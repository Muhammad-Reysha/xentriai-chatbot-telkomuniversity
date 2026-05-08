import { motion } from 'motion/react';
import { Info, GraduationCap, BookOpen, Calendar, Headphones } from 'lucide-react';
import { useApp } from '../../components/AppContext';

export function AdminHero() {
  const { t } = useApp();
  const cards = [
    { icon: GraduationCap, title: t('adminCards.schedule'), desc: t('adminCards.scheduleDesc') },
    { icon: BookOpen, title: t('adminCards.materials'), desc: t('adminCards.materialsDesc') },
    { icon: Calendar, title: t('adminCards.calendar'), desc: t('adminCards.calendarDesc') },
    { icon: Headphones, title: t('adminCards.support'), desc: t('adminCards.supportDesc') },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 md:gap-8 pb-8 pt-4 md:pt-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          {t('adminHero.welcome')} <span className="text-primary-teal">Xentri AI</span>
        </h1>
        <p className="text-text-dim max-w-2xl mx-auto">
          {t('adminHero.desc')}
        </p>
      </div>

      <div className="flex items-center gap-3 px-5 py-2.5 bg-black/20 dark:bg-white/5 border border-primary-teal/20 rounded-full text-sm text-text-dim w-full max-w-[400px] overflow-hidden">
        <Info className="w-4 h-4 text-primary-teal shrink-0" />
        <div className="flex-1 overflow-hidden relative h-5 pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <motion.div
            initial={{ x: 350 }}
            animate={{ x: -400 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute whitespace-nowrap top-0"
          >
            {t('adminHero.marquee')}
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="p-3 md:p-4 rounded-xl border border-white/5 bg-surface-dark/50 hover:bg-white/5 transition-colors cursor-pointer group flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-primary-teal/10 shrink-0">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary-teal" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-semibold text-text-bright mb-0.5">{card.title}</h3>
                <p className="text-xs md:text-sm text-text-dim">{card.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
