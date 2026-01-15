import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Artesana } from '@/data/artesanas';
import { ArtesanaDetail } from './ArtesanaDetail';

interface ArtesanaModalProps {
  artesana: Artesana | null;
  onClose: () => void;
}

export const ArtesanaModal = ({ artesana, onClose }: ArtesanaModalProps) => {
  const [showDetail, setShowDetail] = useState(false);

  if (!artesana) return null;

  // Si se muestra el detalle, renderizar el componente de detalle
  if (showDetail) {
    return (
      <ArtesanaDetail
        artesanaId={artesana.id}
        onBack={() => setShowDetail(false)}
      />
    );
  }

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

        {/* Modal - Tarjeta compacta sin scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-lg max-h-[90vh] bg-card rounded-2xl shadow-2xl texture-grain flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content - Todo ajustado proporcionalmente */}
          <div className="flex flex-col h-full px-6 py-5 sm:px-8 sm:py-6">
            {/* Image placeholder - circular portrait más pequeño */}
            <div className="flex justify-center mb-3 sm:mb-4 shrink-0">
              {artesana.imagenUrl ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent">
                  <img
                    src={artesana.imagenUrl}
                    alt={artesana.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-white text-2xl sm:text-3xl font-display flex items-center justify-center h-full">${artesana.nombre.charAt(0)}</span>`;
                    }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
                  <span className="text-2xl sm:text-3xl font-display">
                    {artesana.nombre.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Name and discipline - Espaciado reducido */}
            <div className="text-center mb-3 sm:mb-4 shrink-0">
              <h2 className="text-lg sm:text-xl font-display font-bold text-foreground mb-1">
                {artesana.nombre}
              </h2>
              <p className="text-sm sm:text-base text-primary font-medium mb-0.5">
                {artesana.disciplina}
              </p>
              <p className="text-xs text-muted-foreground">
                Región {artesana.region} de Chile
              </p>
            </div>

            {/* Biography - Tamaño de texto reducido */}
            <div className="mb-3 sm:mb-4 shrink-0">
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed text-center line-clamp-4">
                {artesana.biografia}
              </p>
            </div>

            {/* Work placeholder - Aspect ratio más compacto */}
            <div className="mb-3 sm:mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 aspect-video flex items-center justify-center shrink-0">
              {artesana.imagenesTrabajo &&
              artesana.imagenesTrabajo.length > 0 ? (
                <img
                  src={artesana.imagenesTrabajo[0]}
                  alt={`Trabajo de ${artesana.nombre}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML =
                      '<span class="text-muted-foreground text-xs">Obra representativa</span>';
                  }}
                />
              ) : (
                <span className="text-muted-foreground text-xs">
                  Obra representativa
                </span>
              )}
            </div>

            {/* Action button - Más compacto */}
            <button
              onClick={() => setShowDetail(true)}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm shrink-0"
            >
              Conocer más
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
