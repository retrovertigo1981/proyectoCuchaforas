import { motion } from 'framer-motion';
import type { Artesana } from '@/data/artesanas';

interface ConstellationPointProps {
  artesana: Artesana;
  onClick: () => void;
  index: number;
}

const disciplinaColors: Record<string, string> = {
  Cerámica: 'bg-brand-red-coral',
  Textil: 'bg-brand-purple',
  Madera: 'bg-brand-mustard',
  Cestería: 'bg-brand-red-bright',
  Orfebrería: 'bg-glow',
  Tejido: 'bg-brand-purple-medium',
};

export const ConstellationPoint = ({
  artesana,
  onClick,
  index,
}: ConstellationPointProps) => {
  const colorClass = disciplinaColors[artesana.disciplina] || 'bg-primary';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.3 }}
      onClick={onClick}
      className="absolute group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
      style={{
        left: `${artesana.posicion.x}%`,
        top: `${artesana.posicion.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={`Ver perfil de ${artesana.nombre}`}
    >
      {/* Halo exterior */}
      <div className="absolute inset-0 -m-4 sm:-m-6 rounded-full bg-glow/20 blur-xl animate-pulse-soft group-hover:bg-glow/40 transition-all duration-300" />

      {/* Punto principal */}
      <div
        className={`
          relative w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full ${colorClass}
          glow-point group-hover:glow-point-hover
          animate-breathe
          transition-all duration-300
        `}
      />

      {/* Ring pulsante */}
      <motion.div
        className="absolute inset-0 -m-1 sm:-m-2 rounded-full border-2 border-glow/60"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
};
