import { X, Book, Phone, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './AppContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { t } = useApp();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-bg-deep border border-white/10 rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-lg md:text-xl font-bold text-text-bright flex items-center gap-2">
                <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-teal" />
                {t('help.title')}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-text-dim hover:text-text-bright rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar space-y-8">
              <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-primary-teal flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  {t('help.tutorial.title')}
                </h3>
                <div className="space-y-3 text-text-dim text-sm leading-relaxed">
                  <p><strong>{t('help.tutorial.1').split(':')[0]}:</strong> {t('help.tutorial.1').split(':').slice(1).join(':')}</p>
                  <p><strong>{t('help.tutorial.2').split(':')[0]}:</strong> {t('help.tutorial.2').split(':').slice(1).join(':')}</p>
                  <p><strong>{t('help.tutorial.3').split(':')[0]}:</strong> {t('help.tutorial.3').split(':').slice(1).join(':')}</p>
                </div>
              </section>

              <div className="w-full h-px bg-white/5" />

              <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-primary-teal flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t('help.contact.title')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-dark border border-white/5">
                    <h4 className="font-medium text-text-bright mb-1">{t('help.contact.it')}</h4>
                    <p className="text-sm text-text-dim">0813-1685-5001</p>
                    <p className="text-xs text-text-dim mt-2">Senin - Jumat, 08:00 - 16:00</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-dark border border-white/5">
                    <h4 className="font-medium text-text-bright mb-1">{t('help.contact.email')}</h4>
                    <p className="text-sm text-text-dim">telkomchatbot@gmail.com</p>
                    <p className="text-xs text-text-dim mt-2">Balasan rata-rata 1x24 jam</p>
                  </div>
                </div>
              </section>

              <div className="w-full h-px bg-white/5" />

              <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-primary-teal flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  FAQ
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="font-medium text-text-bright mb-1">{t('help.faq.1.q')}</p>
                    <p className="text-text-dim">{t('help.faq.1.a')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="font-medium text-text-bright mb-1">{t('help.faq.2.q')}</p>
                    <p className="text-text-dim">{t('help.faq.2.a')}</p>
                  </div>
                </div>
              </section>
            </div>
            
            <div className="p-5 md:p-6 border-t border-white/5 bg-white/5 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-primary-teal text-[#FFFFFF] rounded-lg font-medium hover:brightness-110 transition-all shadow-[0_0_15px_rgba(111,215,214,0.3)]"
              >
                {t('help.close')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
