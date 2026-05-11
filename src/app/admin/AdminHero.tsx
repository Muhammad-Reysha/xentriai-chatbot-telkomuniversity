import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import { useApp } from '../../components/AppContext';

export function AdminHero() {
  const { t } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6 md:gap-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-text-bright">
          {t('adminHero.welcome')} <span className="text-primary-teal">Xentri AI</span>
        </h1>
        <p className="text-base md:text-lg text-text-dim max-w-2xl mx-auto leading-relaxed">
          {t('adminHero.desc')}
        </p>
      </div>

      <div className="flex items-center gap-3 px-5 py-3 bg-surface-dark border border-primary-teal/20 rounded-full text-sm md:text-base text-text-dim w-full max-w-[450px] overflow-hidden mt-4">
        <Info className="w-5 h-5 text-primary-teal shrink-0" />
        <div className="flex-1 overflow-hidden relative h-6 pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <motion.div
            initial={{ x: 350 }}
            animate={{ x: -400 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute whitespace-nowrap top-1/2 -translate-y-1/2"
          >
            {t('adminHero.marquee')}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
