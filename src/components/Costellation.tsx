import { useState } from 'react';
import { motion } from 'framer-motion';
import { ConstellationPoint } from '@/components/CostellationPoint';
import { ArtesanaModal } from '@/components/ArtesanaModal';
import { artesanas } from '@/data/artesanas';
import type { Artesana } from '@/data/artesanas';
import cuchaforaHero from '@/assets/img/cuchafora-hero.jpg';

export const Constellation = () => {
  const [selectedArtesana, setSelectedArtesana] = useState<Artesana | null>(
    null
  );

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background image */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={cuchaforaHero}
            alt="Cuchara tallada artesanal"
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40" />
        </motion.div>

        {/* Constellation points */}
        <div className="absolute inset-0">
          {artesanas.map((artesana, index) => (
            <ConstellationPoint
              key={artesana.id}
              artesana={artesana}
              onClick={() => setSelectedArtesana(artesana)}
              index={index}
            />
          ))}
        </div>

        {/* Connecting lines - subtle SVG overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <defs>
            <linearGradient
              id="lineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="hsl(var(--glow))"
                stopOpacity="0.6"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--glow))"
                stopOpacity="0.2"
              />
            </linearGradient>
          </defs>
          {/* Draw lines between nearby points */}
          {artesanas.map((artesana, i) => {
            if (i < artesanas.length - 1) {
              const nextArtesana = artesanas[i + 1];
              return (
                <motion.line
                  key={`line-${i}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1, delay: i * 0.15 }}
                  x1={`${artesana.posicion.x}%`}
                  y1={`${artesana.posicion.y}%`}
                  x2={`${nextArtesana.posicion.x}%`}
                  y2={`${nextArtesana.posicion.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            }
            return null;
          })}
        </svg>

        {/* Title overlay */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        >
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white drop-shadow-2xl mb-4"
            style={{
              textShadow:
                '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
            }}
          >
            365 historias talladas en madera
          </h1>
          <p
            className="text-lg sm:text-xl lg:text-2xl text-white drop-shadow-lg font-medium"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            Resistencias que brillan en las grietas
          </p>
        </motion.div> */}

        {/* Progress badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-6 left-6 bg-background/95 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border-2 border-primary"
        >
          <p className="text-sm sm:text-base font-medium text-foreground">
            <span className="text-primary font-bold">{artesanas.length}</span>
            <span className="text-muted-foreground">/365 artesanas</span>
          </p>
        </motion.div>

        {/* Scroll indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-6 right-6 sm:left-1/2 sm:-translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p
            className="text-sm text-white font-semibold drop-shadow-lg"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            Explora las historias
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-white/80 flex items-start justify-center pt-2 backdrop-blur-sm bg-black/20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </motion.div>
        </motion.div> */}
      </div>

      {/* Modal */}
      {selectedArtesana && (
        <ArtesanaModal
          artesana={selectedArtesana}
          onClose={() => setSelectedArtesana(null)}
        />
      )}
    </>
  );
};
