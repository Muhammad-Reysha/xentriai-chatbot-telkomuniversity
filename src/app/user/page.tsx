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
import { GoogleGenAI } from '@google/genai';
import { Message, ChatSession } from '../../types';
import { useApp } from '../../components/AppContext';

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

  const currentMessages = chatSessions.find(s => s.id === currentChatId)?.messages || [];

  useEffect(() => {
    if (scrollRef.current && currentMessages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isLoading]);

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;
    
    const messageText = text.trim() || (image ? "Tolong jelaskan gambar ini secara singkat." : "");
    const newMessage: Message = { id: Date.now().toString(), role: 'user', text: messageText, image };
    
    let activeSessionId = currentChatId;
    let sessionList = [...chatSessions];
    let sessionIndex = sessionList.findIndex(s => s.id === activeSessionId);

    if (sessionIndex === -1) {
      activeSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: activeSessionId,
        title: messageText.substring(0, 40) + (messageText.length > 40 ? '...' : ''),
        timestamp: Date.now(),
        messages: [newMessage]
      };
      sessionList = [newSession, ...sessionList];
      setCurrentChatId(activeSessionId);
      sessionIndex = 0;
    } else {
      const updatedSession = { ...sessionList[sessionIndex], messages: [...sessionList[sessionIndex].messages, newMessage] };
      sessionList[sessionIndex] = updatedSession;
    }

    setChatSessions(sessionList);
    setIsLoading(true);

    const activeMessages = sessionList[sessionIndex].messages;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key tidak ditemukan. Pastikan sudah mengatur environment variable.");
      const ai = new GoogleGenAI({ apiKey });

      const formattedContents = activeMessages.map(m => {
        const parts: any[] = [];
        if (m.text) parts.push({ text: m.text });
        if (m.image) {
          const base64Data = m.image.split(',')[1];
          const mimeType = m.image.split(',')[0].split(':')[1].split(';')[0];
          parts.push({ inlineData: { data: base64Data, mimeType } });
        }
        return { role: m.role, parts };
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: formattedContents,
        config: { systemInstruction: "You are Xentri AI, a helpful virtual campus assistant for students." }
      });

      const returnText = response.text || "Maaf, saya tidak dapat merespons saat ini.";
      const botMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: returnText };
      
      setChatSessions(prev => prev.map(session => session.id === activeSessionId ? { ...session, messages: [...session.messages, botMessage] } : session));
    } catch (error) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: "Terjadi kesalahan saat menghubungi API asisten cerdas." };
      setChatSessions(prev => prev.map(session => session.id === activeSessionId ? { ...session, messages: [...session.messages, errorMessage] } : session));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex bg-bg-deep text-text-bright font-sans selection:bg-primary-teal/30 overflow-hidden">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activeTab={activeTab} setActiveTab={handleTabChange} onOpenHelp={() => setIsHelpOpen(true)} />
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <UserHeader onMenuClick={toggleSidebar} />
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-4 md:p-10 relative scroll-smooth">
          {activeTab === 'new-chat' ? (
            currentMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center pb-10 min-h-min">
                <UserHero />
              </div>
            ) : (
              <ChatMessages messages={currentMessages} isLoading={isLoading} />
            )
          ) : activeTab === 'history' ? (
            <HistoryPage chatSessions={chatSessions} onSelectSession={handleSelectSession} onClearHistory={() => setChatSessions([])} />
          ) : activeTab === 'settings' ? (
            <SettingsPage onClearHistory={() => setChatSessions([])} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-dim">Coming soon.</div>
          )}
        </div>
        {activeTab === 'new-chat' && (
          <div className="flex-none p-4 md:p-8 shrink-0 bg-transparent flex justify-center w-full">
            <div className="w-full max-w-4xl">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} placeholder={t('placeholder.type')} />
            </div>
          </div>
        )}
      </main>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
