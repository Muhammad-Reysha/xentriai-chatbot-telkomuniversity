import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';
import { useApp } from '../../components/AppContext';

export function UserHero() {
  const { t } = useApp();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 p-8"
    >
      <div className="text-left space-y-6 max-w-lg">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {t('userHero.welcome')}<br/>
          <span className="text-primary-teal">XentriAI</span>
        </h1>
        <p className="text-text-dim text-lg">
          {t('userHero.desc')}
        </p>
      </div>

      <div className="hidden md:flex relative w-72 h-72 rounded-3xl border border-primary-teal/20 bg-surface-dark/30 items-center justify-center shadow-[0_0_50px_rgba(42,160,134,0.1)] overflow-hidden">
        {/* Abstract Grid Graphic */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(111,215,214,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(111,215,214,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute w-48 h-48 border border-primary-teal/20 rounded-full z-0 opacity-40"></div>
        <div className="absolute w-64 h-64 border border-dashed border-primary-teal/30 rounded-full z-0 opacity-30 animate-[spin_60s_linear_infinite]"></div>
        
        {/* Glow behind CPU */}
        <div className="absolute bg-primary-teal/20 w-32 h-32 blur-2xl rounded-full z-0"></div>
        
        <Cpu className="w-24 h-24 text-primary-teal z-10" />
      </div>
    </motion.div>
  );
}
