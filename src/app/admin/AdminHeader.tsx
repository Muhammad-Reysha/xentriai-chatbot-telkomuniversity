import { Menu, Bell, HelpCircle, User, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../components/AppContext';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onHelpClick?: () => void;
}

export function AdminHeader({ onMenuClick, onHelpClick }: AdminHeaderProps) {
  const { t } = useApp();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  const notifications = [
    { id: 1, title: 'Update Xentri AI', desc: 'Fitur baru ditambahkan pada dashboard admin.', time: '1 jam lalu', type: 'info' }
  ];

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-bg-deep/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-text-dim hover:text-primary-teal hover:bg-white/5 rounded-lg transition-all">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-primary-teal font-semibold text-lg hidden md:block">Xentri AI</h2>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative" ref={notificationRef}>
          <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className={`p-2 hover:text-primary-teal hover:bg-white/5 rounded-full transition-all relative ${isNotificationOpen ? 'bg-white/5 text-primary-teal' : 'text-text-dim'}`}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-teal rounded-full animate-pulse blur-[1px]"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-teal rounded-full shadow-[0_0_5px_#2AA086]"></span>
          </button>

          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-x-4 md:inset-auto md:absolute md:-right-2 top-[72px] md:top-full mt-0 md:mt-2 md:w-96 bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] md:origin-top-right flex flex-col max-h-[80vh]"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                  <h3 className="font-semibold text-text-bright">{t('header.notification')}</h3>
                  <button onClick={() => setIsNotificationOpen(false)} className="text-text-dim hover:text-text-bright transition-colors rounded-full p-1 hover:bg-white/10"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-4 text-center text-sm text-text-dim">{t('header.noNewNotification')}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={onHelpClick} className="p-2 text-text-dim hover:text-primary-teal hover:bg-white/5 rounded-full transition-all">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-dark flex items-center justify-center border border-white/20 ml-2 cursor-pointer hover:border-white/50 transition-colors">
          <User className="w-5 h-5 text-text-bright" />
        </div>
      </div>
    </header>
  );
}
