'use client';

import { useState, useRef, useEffect } from 'react';
import { UserSidebar } from './UserSidebar';
import { UserHeader } from './UserHeader';
import { UserHero } from './UserHero';
import { ChatInput } from '../../components/ChatInput';
import { ChatMessages } from '../../components/ChatMessages';
import { HistoryPage } from '../../components/HistoryPage';
import { SettingsPage } from '../../components/SettingsPage';
import { HelpModal } from '../../components/HelpModal';
import { Message, ChatSession } from '../../types';
import { useApp } from '../../components/AppContext';

// Normalisasi: pastikan single \n jadi double \n agar markdown render paragraf
export const normalizeResponse = (text: string) => {
  const decoded = text.replace(/\\n/g, '\n');

  const mathFixed = decoded
    .replace(/\\\[/g, '$$')  // \[ → $$
    .replace(/\\\]/g, '$$')  // \] → $$
    .replace(/\\\(/g, '$')   // \( → $
    .replace(/\\\)/g, '$');  // \) → $

  // Step 1: Ubah semua unicode bullet jadi "- "
  const bulleted = mathFixed.replace(/^[•·●▪▸◆]\s*/gm, '- ');

  // Step 2: Merge baris yang HANYA berisi "-" dengan baris teks berikutnya
  const lines = bulleted.split('\n');
  const merged: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === '-') {
      // Cari baris non-kosong berikutnya
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;

      if (j < lines.length) {
        merged.push('- ' + lines[j].trim());
        i = j; // skip baris yang sudah digabung
      }
      continue;
    }

    merged.push(lines[i]);
  }

  // Step 3: Hapus blank line di antara list item yang berurutan
  const result: string[] = [];
  for (let i = 0; i < merged.length; i++) {
    const isEmpty = merged[i].trim() === '';
    const prevIsList = merged[i - 1]?.trim().startsWith('- ') ?? false;
    const nextIsList = merged[i + 1]?.trim().startsWith('- ') ?? false;

    if (isEmpty && prevIsList && nextIsList) continue; // buang blank antar list

    result.push(merged[i]);
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n');
};

export default function UserPage() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState('new-chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'new-chat') {
      setCurrentChatId(null);
    }
  };

  const handleSelectSession = (id: string) => {
    setCurrentChatId(id);
    setActiveTab('new-chat');
  };

  const currentMessages =
    chatSessions.find((s) => s.id === currentChatId)?.messages || [];

  useEffect(() => {
    if (scrollRef.current && currentMessages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isLoading]);

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const messageText =
      text.trim() || (image ? 'Tolong jelaskan gambar ini secara singkat.' : '');
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      image,
    };

    let activeSessionId = currentChatId;
    let sessionList = [...chatSessions];
    let sessionIndex = sessionList.findIndex((s) => s.id === activeSessionId);

    if (sessionIndex === -1) {
      activeSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: activeSessionId,
        title:
          messageText.substring(0, 40) + (messageText.length > 40 ? '...' : ''),
        timestamp: Date.now(),
        messages: [newMessage],
      };
      sessionList = [newSession, ...sessionList];
      setCurrentChatId(activeSessionId);
      sessionIndex = 0;
    } else {
      const updatedSession = {
        ...sessionList[sessionIndex],
        messages: [...sessionList[sessionIndex].messages, newMessage],
      };
      sessionList[sessionIndex] = updatedSession;
    }

    setChatSessions(sessionList);
    setIsLoading(true);

    // Insert an empty bot message immediately so UI can render a typing indicator
    const botMessageId = (Date.now() + 1).toString();
    const placeholderMessage: Message = {
      id: botMessageId,
      role: 'model',
      text: '',
    };

    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? { ...session, messages: [...session.messages, placeholderMessage] }
          : session
      )
    );

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: messageText, model: 'model1' }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Akumulasi buffer dulu, jangan langsung split
        buffer += decoder.decode(value, { stream: true });

        // SSE events dipisahkan oleh "\n\n"
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? ''; // Simpan event yang belum lengkap

        for (const event of events) {
          for (const line of event.split('\n')) {
            if (line.startsWith('data: ')) {
              const chunk = line.slice(6);
              if (chunk === '[DONE]') continue;

              setChatSessions((prev) =>
                prev.map((session) =>
                  session.id === activeSessionId
                    ? {
                        ...session,
                        messages: session.messages.map((m) =>
                          m.id === botMessageId
                            ? { ...m, text: m.text + chunk }
                            : m
                        ),
                      }
                    : session
                )
              );
            }
          }
        }
      }

      // Proses sisa buffer
      if (buffer.startsWith('data: ')) {
        const chunk = buffer.slice(6);
        if (chunk !== '[DONE]') {
          setChatSessions((prev) =>
            prev.map((session) =>
              session.id === activeSessionId
                ? {
                    ...session,
                    messages: session.messages.map((m) =>
                      m.id === botMessageId
                        ? { ...m, text: m.text + chunk }
                        : m
                    ),
                  }
                : session
            )
          );
        }
      }
    } catch (error) {
      const errorText =
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : 'Terjadi kesalahan saat menghubungi API asisten cerdas.';

      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: session.messages.map((m) =>
                  m.id === botMessageId ? { ...m, text: errorText } : m
                ),
              }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex bg-bg-deep text-text-bright font-sans selection:bg-primary-teal/30 overflow-hidden">
      <UserSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenHelp={() => setIsHelpOpen(true)}
      />
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <UserHeader onMenuClick={toggleSidebar} />
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-4 md:p-10 relative scroll-smooth"
        >
          {activeTab === 'new-chat' ? (
            currentMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center pb-10 min-h-min">
                <UserHero />
              </div>
            ) : (
              <ChatMessages messages={currentMessages} isLoading={isLoading} />
            )
          ) : activeTab === 'history' ? (
            <HistoryPage
              chatSessions={chatSessions}
              onSelectSession={handleSelectSession}
              onClearHistory={() => setChatSessions([])}
            />
          ) : activeTab === 'settings' ? (
            <SettingsPage onClearHistory={() => setChatSessions([])} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-dim">
              Coming soon.
            </div>
          )}
        </div>
        {activeTab === 'new-chat' && (
          <div className="flex-none p-4 md:p-8 shrink-0 bg-transparent flex justify-center w-full">
            <div className="w-full max-w-4xl">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder={t('placeholder.type')}
              />
            </div>
          </div>
        )}
      </main>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}