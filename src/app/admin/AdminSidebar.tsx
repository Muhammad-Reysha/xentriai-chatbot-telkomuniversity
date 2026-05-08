import { Plus, LayoutDashboard, Upload, Settings, HelpCircle, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../components/Logo';
import { useApp } from '../../components/AppContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHelp?: () => void;
}

export function AdminSidebar({ isOpen, onClose, activeTab, setActiveTab, onOpenHelp }: AdminSidebarProps) {
  const { t } = useApp();

  const adminNavItems = [
    { id: 'admin-dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'admin-upload', label: t('sidebar.uploadFiles'), icon: Upload },
    { id: 'settings', label: t('sidebar.settings'), icon: Settings },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 w-[280px] border-r border-primary-teal/10 flex flex-col bg-bg-sidebar z-[70] transition-transform duration-300 lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 space-y-8 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center border border-white/20">
                <Logo className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-primary-teal font-bold text-xl leading-none">Xentri AI</h1>
                <span className="text-text-dim text-xs font-medium">Campus Assistant</span>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-text-dim hover:text-text-bright">
              <X className="w-6 h-6" />
            </button>
          </div>

          <button onClick={onOpenHelp} className="w-full bg-primary-teal text-[#FFFFFF] py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(111,215,214,0.3)] group">
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {t('sidebar.getHelp')}
          </button>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary-teal/10 text-primary-teal border-r-2 border-primary-teal' : 'text-text-dim hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-teal'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-teal' : 'group-hover:text-primary-teal'}`} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-text-dim/10 space-y-1">
          <button className="w-full flex items-center gap-3 py-2 px-3 mt-4 rounded-lg text-text-dim hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-teal transition-all group">
            <LogOut className="w-4 h-4 group-hover:text-primary-teal" />
            <span className="text-sm font-medium">{t('sidebar.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
