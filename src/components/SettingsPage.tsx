import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Shield, Moon, Sun, Globe, Palette, AlertTriangle } from 'lucide-react';
import { useApp } from './AppContext';

export function SettingsPage({ onClearHistory }: { onClearHistory?: () => void }) {
  const [activeSegment, setActiveSegment] = useState('appearance');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { theme, setTheme, language, setLanguage, t } = useApp();

  const settingsSegments = [
    { id: 'appearance', label: t('settings.appearance'), icon: Palette },
    { id: 'privacy', label: t('settings.privacy'), icon: Shield },
    { id: 'language', label: t('settings.language'), icon: Globe },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-64 flex-shrink-0"
      >
        <h2 className="text-text-bright text-2xl font-bold mb-6">{t('settings.title')}</h2>
        <div className="flex flex-col gap-1">
          {settingsSegments.map((segment) => {
            const Icon = segment.icon;
            const isActive = activeSegment === segment.id;
            return (
              <button
                key={segment.id}
                onClick={() => setActiveSegment(segment.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  isActive 
                    ? 'bg-primary-teal/10 text-primary-teal font-semibold' 
                    : 'text-text-dim hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-teal'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{segment.label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      <motion.div 
        key={activeSegment}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-surface-dark/50 border border-text-dim/10 rounded-3xl p-6 md:p-8"
      >
        {activeSegment === 'appearance' && (
          <div className="space-y-8">
            <div>
               <h3 className="text-lg font-semibold text-text-bright mb-4">{t('appearance.title')}</h3>
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                 <button 
                   onClick={() => setTheme('dark')}
                   className={`flex justify-center flex-col gap-2 items-center p-4 rounded-2xl border-2 transition-all ${
                     theme === 'dark' 
                       ? 'border-primary-teal bg-primary-teal/10 text-primary-teal' 
                       : 'border-transparent bg-black/5 dark:bg-white/5 text-text-dim hover:bg-black/10 dark:hover:bg-white/10'
                   }`}
                 >
                    <Moon className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('appearance.dark')} {theme === 'dark' && t('appearance.active')}</span>
                 </button>
                 <button 
                   onClick={() => setTheme('light')}
                   className={`flex justify-center flex-col gap-2 items-center p-4 rounded-2xl border-2 transition-all ${
                     theme === 'light' 
                       ? 'border-primary-teal bg-primary-teal/10 text-primary-teal' 
                       : 'border-transparent bg-black/5 dark:bg-white/5 text-text-dim hover:bg-black/10 dark:hover:bg-white/10'
                   }`}
                 >
                    <Sun className="w-6 h-6" />
                    <span className="text-sm font-medium">{t('appearance.light')} {theme === 'light' && t('appearance.active')}</span>
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeSegment === 'language' && (
          <div className="space-y-8">
            <div>
               <h3 className="text-lg font-semibold text-text-bright mb-4">{t('language.title')}</h3>
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                 <button 
                   onClick={() => setLanguage('id')}
                   className={`flex justify-center flex-col gap-2 items-center p-4 rounded-2xl border-2 transition-all ${
                     language === 'id' 
                       ? 'border-primary-teal bg-primary-teal/10 text-primary-teal' 
                       : 'border-transparent bg-black/5 dark:bg-white/5 text-text-dim hover:bg-black/10 dark:hover:bg-white/10'
                   }`}
                 >
                    <span className="text-2xl">🇮🇩</span>
                    <span className="text-sm font-medium">{t('language.id')} {language === 'id' && t('language.active')}</span>
                 </button>
                 <button 
                   onClick={() => setLanguage('en')}
                   className={`flex justify-center flex-col gap-2 items-center p-4 rounded-2xl border-2 transition-all ${
                     language === 'en' 
                       ? 'border-primary-teal bg-primary-teal/10 text-primary-teal' 
                       : 'border-transparent bg-black/5 dark:bg-white/5 text-text-dim hover:bg-black/10 dark:hover:bg-white/10'
                   }`}
                 >
                    <span className="text-2xl">🇬🇧</span>
                    <span className="text-sm font-medium">{t('language.en')} {language === 'en' && t('language.active')}</span>
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeSegment === 'notifications' && (
          <div className="space-y-8">
             <h3 className="text-lg font-semibold text-text-bright mb-4">Preferensi Notifikasi</h3>
             <div className="space-y-4">
                {[
                  { title: 'Notifikasi Chat', desc: 'Dapatkan pemberitahuan ketika pesan baru masuk.' },
                  { title: 'Pembaruan Sistem', desc: 'Informasi mengenai fitur baru dan pembaruan.' },
                  { title: 'Pengingat Aktivitas', desc: 'Pengingat tentang aktivitas yang belum selesai.' }
                ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-text-dim/10">
                      <div>
                         <h4 className="text-text-bright text-sm font-medium">{item.title}</h4>
                         <p className="text-text-dim text-xs mt-1">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-primary-teal rounded-full relative cursor-pointer">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeSegment === 'privacy' && (
          <div className="space-y-8">
             <h3 className="text-lg font-semibold text-text-bright mb-4">{t('privacy.title')}</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-text-dim/10">
                  <div>
                     <h4 className="text-text-bright text-sm font-medium">{t('privacy.dataSharing')}</h4>
                     <p className="text-text-dim text-xs mt-1">{t('privacy.dataSharing.desc')}</p>
                  </div>
                  <div className="w-12 h-6 bg-primary-teal rounded-full relative cursor-pointer flex-shrink-0">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-text-dim/10">
                  <div>
                     <h4 className="text-text-bright text-sm font-medium">{t('privacy.saveHistory')}</h4>
                     <p className="text-text-dim text-xs mt-1">{t('privacy.saveHistory.desc')}</p>
                  </div>
                  <div className="w-12 h-6 bg-primary-teal rounded-full relative cursor-pointer flex-shrink-0">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
             </div>

             <div className="pt-4 border-t border-text-dim/10">
                <button 
                  onClick={() => setShowConfirmDialog(true)}
                  className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors rounded-xl text-sm font-medium border border-red-500/20"
                >
                  {t('privacy.clearHistory')}
                </button>
             </div>
          </div>
        )}

      </motion.div>

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
                <h3 className="text-xl font-bold text-text-bright mb-2">Hapus Semua Riwayat?</h3>
                <p className="text-text-dim text-sm mb-6">
                  Tindakan ini tidak dapat dibatalkan. Semua riwayat percakapan Anda akan dihapus secara permanen dari perangkat ini.
                </p>
                <div className="flex w-full gap-3">
                  <button 
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-text-bright hover:bg-white/5 transition-colors font-medium text-sm"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => {
                      if (onClearHistory) onClearHistory();
                      setShowConfirmDialog(false);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium text-sm"
                  >
                    Ya, Hapus
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
