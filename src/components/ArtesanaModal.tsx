import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Artesana } from '@/data/artesanas';

interface ArtesanaModalProps {
  artesana: Artesana | null;
  onClose: () => void;
}

export const ArtesanaModal = ({ artesana, onClose }: ArtesanaModalProps) => {
  if (!artesana) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden texture-grain"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Image placeholder - circular portrait */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
                <span className="text-4xl sm:text-5xl font-display">
                  {artesana.nombre.charAt(0)}
                </span>
              </div>
            </div>

            {/* Name and discipline */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                {artesana.nombre}
              </h2>
              <p className="text-lg text-primary font-medium mb-1">
                {artesana.disciplina}
              </p>
              <p className="text-sm text-muted-foreground">
                Región {artesana.region} de Chile
              </p>
            </div>

            {/* Biography */}
            <div className="mb-6">
              <p className="text-base sm:text-lg text-foreground/90 leading-relaxed text-center">
                {artesana.biografia}
              </p>
            </div>

            {/* Work placeholder */}
            <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 aspect-[4/3] flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                Obra representativa
              </span>
            </div>

            {/* Action button */}
            <button className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Conocer más
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
