import { Search, Clock, MessageSquare, ChevronRight, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatSession } from '../types';
import { useState } from 'react';
import { useApp } from './AppContext';

interface HistoryPageProps {
  chatSessions: ChatSession[];
  onSelectSession: (id: string) => void;
  onClearHistory?: () => void;
}

export function HistoryPage({ chatSessions, onSelectSession, onClearHistory }: HistoryPageProps) {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const now = new Date();

  const filteredSessions = chatSessions.filter(s => {
    const matchesQuery = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesDate = true;
    if (dateFilter) {
       const sessionDate = new Date(s.timestamp).toISOString().split('T')[0];
       matchesDate = sessionDate === dateFilter;
    }

    return matchesQuery && matchesDate;
  });

  const todaySessions = filteredSessions.filter(s => {
    const d = new Date(s.timestamp);
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const yesterdaySessions = filteredSessions.filter(s => {
    const d = new Date(s.timestamp);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear();
  });

  const olderSessions = filteredSessions.filter(s => {
    const d = new Date(s.timestamp);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return d < yesterday;
  });

  const historyGroups = [];
  if (todaySessions.length) {
    historyGroups.push({ title: t('history.group.today'), items: todaySessions });
  }
  if (yesterdaySessions.length) {
    historyGroups.push({ title: t('history.group.yesterday'), items: yesterdaySessions });
  }
  if (olderSessions.length) {
    historyGroups.push({ title: t('history.group.older'), items: olderSessions });
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4"
      >
        <div className="flex items-start justify-between w-full md:w-auto md:flex-col md:justify-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-bright font-sans flex items-center gap-3">
              {t('history.title')}
            </h2>
            <p className="text-text-dim mt-2 text-sm md:text-base pr-4 md:pr-0">{t('history.desc')}</p>
          </div>
          {chatSessions.length > 0 && (
            <button 
              onClick={() => setShowConfirmDialog(true)}
              className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20 md:hidden mt-2"
              title={t('history.clearAll')}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input 
              type="text" 
              placeholder={t('history.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-dark/80 backdrop-blur-md border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-text-bright placeholder-text-dim/50 focus:outline-none focus:border-primary-teal/50 focus:ring-1 focus:ring-primary-teal/50 transition-all text-sm"
            />
          </div>
          <div className="relative w-full md:w-48">
             <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
             <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-surface-dark/80 backdrop-blur-md border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-text-bright focus:outline-none focus:border-primary-teal/50 focus:ring-1 focus:ring-primary-teal/50 transition-all text-sm appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
            />
          </div>
          {chatSessions.length > 0 && (
            <button 
              onClick={() => setShowConfirmDialog(true)}
              className="hidden md:flex p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
              title={t('history.clearAll')}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {historyGroups.length === 0 ? (
         <div className="text-center py-20 bg-surface-dark/30 rounded-3xl border border-white/5">
            <MessageSquare className="w-12 h-12 text-text-dim/30 mx-auto mb-4" />
            <h3 className="text-text-bright font-semibold text-lg mb-2">{t('history.empty.title')}</h3>
            <p className="text-text-dim text-sm">{t('history.empty.desc')}</p>
         </div>
      ) : (
        <div className="space-y-8 mt-4">
          {historyGroups.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-sm font-bold text-primary-teal tracking-wider uppercase px-1">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((item, itemIdx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx * 2 + itemIdx) * 0.05 }}
                    onClick={() => onSelectSession(item.id)}
                    className="bg-surface-dark/60 hover:bg-surface-dark border border-white/5 hover:border-primary-teal/30 backdrop-blur-xl rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-300 group flex items-start gap-4 shadow-lg hover:shadow-[0_4px_20px_rgba(111,215,214,0.1)]"
                  >
                    <div className="p-3 bg-bg-deep rounded-xl text-text-dim group-hover:text-primary-teal group-hover:bg-primary-teal/10 transition-colors duration-300">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-text-bright font-semibold text-base truncate transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2.5 text-xs font-medium text-text-dim/70">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{item.messages.length} {t('history.messages')}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-dim/30 group-hover:text-primary-teal transition-colors duration-300 self-center transform group-hover:translate-x-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-dark border border-white/10 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-bright mb-2">{t('history.confirm.title')}</h3>
                <p className="text-text-dim text-sm mb-6">
                  {t('history.confirm.desc')}
                </p>
                <div className="flex w-full gap-3">
                  <button 
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-text-bright hover:bg-white/5 transition-colors font-medium text-sm"
                  >
                    {t('history.confirm.cancel')}
                  </button>
                  <button 
                    onClick={() => {
                      if (onClearHistory) onClearHistory();
                      setShowConfirmDialog(false);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium text-sm"
                  >
                    {t('history.confirm.delete')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
