// Componente para renderizar el fondo interactivo "Patrón de Vetas + Constelación"
import React from 'react';
import { motion } from 'framer-motion';
import type { ViewState } from '@/types/constellation-map';

interface BackgroundRendererProps {
  viewState: ViewState;
  className?: string;
}

export const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({
  viewState,
  className = '',
}) => {
  // Calcular transformación del fondo para seguir el movimiento
  const backgroundTransform = `translate(${-viewState.x * 0.5}px, ${-viewState.y * 0.5}px) scale(${1 + (viewState.scale - 1) * 0.3})`;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gradiente base coherente con el header */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#656293] via-[#7a7ab8] to-[#9695c3]"
        style={{
          transform: backgroundTransform,
        }}
      />

      {/* Patrón SVG de vetas de madera */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          transform: backgroundTransform,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="w-full h-full"
        >
          <defs>
            <pattern
              id="woodGrain"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,5 Q5,0 10,5 T20,5"
                stroke="rgba(139, 69, 19, 0.3)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0,15 Q5,10 10,15 T20,15"
                stroke="rgba(139, 69, 19, 0.2)"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#woodGrain)" />
        </svg>
      </div>

      {/* Estrellas formando silueta de cuchara */}
      <div
        className="absolute inset-0"
        style={{
          transform: backgroundTransform,
        }}
      >
        <SpoonConstellation />
      </div>

      {/* Partículas flotantes adicionales */}
      <FloatingParticles count={20} />
    </div>
  );
};

// Componente para la constelación en forma de cuchara
const SpoonConstellation: React.FC = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      className="w-full h-full"
    >
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>
      </defs>

      {/* Estrellas principales formando silueta de cuchara */}
      {spoonStars.map((star, index) => (
        <motion.circle
          key={index}
          cx={star.x}
          cy={star.y}
          r={star.size}
          fill="url(#starGlow)"
          opacity={star.opacity}
          animate={{
            opacity: [star.opacity * 0.7, star.opacity, star.opacity * 0.7],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3 + index * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
        />
      ))}

      {/* Líneas conectoras sutiles */}
      <g opacity="0.3">
        {spoonConnections.map((connection, index) => (
          <motion.line
            key={index}
            x1={connection.x1}
            y1={connection.y1}
            x2={connection.x2}
            y2={connection.y2}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{
              duration: 2,
              delay: index * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </g>
    </svg>
  );
};

// Componente para partículas flotantes
const FloatingParticles: React.FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </>
  );
};

// Datos de las estrellas formando silueta de cuchara
const spoonStars = [
  // Mango de la cuchara
  { x: 50, y: 150, size: 2, opacity: 0.8 },
  { x: 60, y: 140, size: 1.5, opacity: 0.6 },
  { x: 70, y: 130, size: 1.8, opacity: 0.7 },
  { x: 80, y: 120, size: 2.2, opacity: 0.9 },
  { x: 90, y: 110, size: 1.6, opacity: 0.5 },
  { x: 100, y: 100, size: 2.5, opacity: 1 },

  // Transición al bowl
  { x: 120, y: 90, size: 2, opacity: 0.8 },
  { x: 140, y: 85, size: 1.7, opacity: 0.6 },
  { x: 160, y: 80, size: 2.1, opacity: 0.8 },
  { x: 180, y: 75, size: 1.9, opacity: 0.7 },

  // Bowl de la cuchara (parte más ancha)
  { x: 200, y: 70, size: 2.3, opacity: 0.9 },
  { x: 220, y: 75, size: 2, opacity: 0.8 },
  { x: 240, y: 85, size: 2.2, opacity: 0.9 },
  { x: 260, y: 95, size: 2.1, opacity: 0.8 },
  { x: 280, y: 110, size: 1.8, opacity: 0.7 },
  { x: 300, y: 125, size: 2, opacity: 0.8 },
  { x: 320, y: 140, size: 1.5, opacity: 0.6 },
  { x: 340, y: 150, size: 2.2, opacity: 0.9 },
  { x: 350, y: 155, size: 1.7, opacity: 0.7 },

  // Estrellas decorativas alrededor
  { x: 30, y: 180, size: 1.2, opacity: 0.5 },
  { x: 110, y: 60, size: 1.4, opacity: 0.6 },
  { x: 190, y: 50, size: 1.3, opacity: 0.5 },
  { x: 270, y: 60, size: 1.1, opacity: 0.4 },
  { x: 360, y: 130, size: 1.6, opacity: 0.6 },
];

// Conexiones entre estrellas para formar la silueta
const spoonConnections = [
  // Mango
  { x1: 50, y1: 150, x2: 60, y2: 140 },
  { x1: 60, y1: 140, x2: 70, y2: 130 },
  { x1: 70, y1: 130, x2: 80, y2: 120 },
  { x1: 80, y1: 120, x2: 90, y2: 110 },
  { x1: 90, y1: 110, x2: 100, y2: 100 },

  // Transición
  { x1: 100, y1: 100, x2: 120, y2: 90 },
  { x1: 120, y1: 90, x2: 140, y2: 85 },
  { x1: 140, y1: 85, x2: 160, y2: 80 },
  { x1: 160, y1: 80, x2: 180, y2: 75 },

  // Bowl
  { x1: 180, y1: 75, x2: 200, y2: 70 },
  { x1: 200, y1: 70, x2: 220, y2: 75 },
  { x1: 220, y1: 75, x2: 240, y2: 85 },
  { x1: 240, y1: 85, x2: 260, y2: 95 },
  { x1: 260, y1: 95, x2: 280, y2: 110 },
  { x1: 280, y1: 110, x2: 300, y2: 125 },
  { x1: 300, y1: 125, x2: 320, y2: 140 },
  { x1: 320, y1: 140, x2: 340, y2: 150 },
  { x1: 340, y1: 150, x2: 350, y2: 155 },
];

export default BackgroundRenderer;
