import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Howl } from 'howler';
import { ArtesanaModal } from './ArtesanaModal';
import type { Artesana as BasicArtesanaType } from '@/data/artesanas';

// IMPORTANTE: Este componente debe recibir las artesanas ya con su estructura base
// La distribución radial se calcula internamente

interface Artesana extends BasicArtesanaType {
  x: number;
  y: number;
  screenX: number;
  screenY: number;
  opacity: number;
  scale: number;
  color: string;
}

interface ViewState {
  x: number;
  y: number;
  scale: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startViewX: number;
  startViewY: number;
}

interface ConstellationMapProps {
  artesanas: BasicArtesanaType[];
  selectedDisciplina?: string | null;
  selectedRegion?: string | null;
}

// Dimensiones del mundo virtual
const WORLD_DIMENSIONS = {
  width: 3000,
  height: 3000,
};

const ZOOM_LEVELS = {
  min: 0.3,
  max: 2.5,
  step: 0.2,
};

// Paleta de colores proporcionada (en hexadecimal)
const COLOR_PALETTE = [
  '#7e7bab',
  '#ffd633',
  '#9695c3',
  '#656293',
  '#bab8dd',
  '#feca17',
  '#b28710',
  '#d9a906',
  '#ef7b6f',
  '#e7312b',
  '#cb281a',
  '#ea5a4c',
];

// Función para obtener un color consistente basado en el ID de la artesana
// Esto asegura que cada artesana siempre tenga el mismo color
const getColorForArtesana = (artesanaId: string): string => {
  // Usar el ID para generar un índice consistente
  let hash = 0;
  for (let i = 0; i < artesanaId.length; i++) {
    hash = artesanaId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

// Función para distribuir artesanas radialmente
const distributeRadially = (artesanas: BasicArtesanaType[]): Artesana[] => {
  const centerX = WORLD_DIMENSIONS.width / 2;
  const centerY = WORLD_DIMENSIONS.height / 2;

  // Calcular radio máximo adaptativo según el número de artesanas
  // Para pocas artesanas: radio más pequeño para que quepan en pantalla
  // Para muchas artesanas: radio más grande para que se distribuyan bien
  const count = artesanas.length;
  const baseRadius = 400; // Radio base para ~10 artesanas
  const extraRadius = Math.sqrt(count) * 80; // Añadir radio según cantidad
  const maxRadius = baseRadius + extraRadius;

  // Configuración de anillos
  const numRings = Math.max(1, Math.ceil(Math.sqrt(count / Math.PI)));
  const pointsPerRing = Math.ceil(count / numRings);

  return artesanas.map((artesana, index) => {
    // Determinar en qué anillo va este punto
    const ringIndex = Math.floor(index / pointsPerRing);
    const positionInRing = index % pointsPerRing;
    const totalInRing = Math.min(
      pointsPerRing,
      artesanas.length - ringIndex * pointsPerRing
    );

    // Radio del anillo - usar transformación no lineal para evitar radio 0
    const ringProgress = Math.pow(ringIndex / Math.max(numRings - 1, 1), 0.7);
    const minRingSpacing = 120; // Radio mínimo entre anillos (aumentado para más espacio)
    const radius =
      minRingSpacing +
      (maxRadius - minRingSpacing) * ringProgress * (0.9 + Math.random() * 0.2);

    // Ángulo con más aleatoriedad para dispersar puntos
    const baseAngle = (positionInRing / totalInRing) * 2 * Math.PI;
    const angleVariation = (Math.random() - 0.5) * 0.8;
    const angle = baseAngle + angleVariation;

    // Posición final
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    // Asignar color consistente basado en el ID
    const color = getColorForArtesana(artesana.id);

    return {
      ...artesana,
      x,
      y,
      screenX: 0,
      screenY: 0,
      opacity: 1,
      scale: 1,
      color,
    };
  });
};

export default function ConstellationMapImproved({
  artesanas: rawArtesanas,
  selectedDisciplina,
  selectedRegion,
}: ConstellationMapProps) {
  const [selectedArtesana, setSelectedArtesana] = useState<Artesana | null>(
    null
  );
  const [viewState, setViewState] = useState<ViewState>({
    x: WORLD_DIMENSIONS.width / 2,
    y: WORLD_DIMENSIONS.height / 2,
    scale: 1,
  });
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startViewX: 0,
    startViewY: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverSoundRef = useRef<Howl | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const isAudioInitialized = useRef(false);

  // Inicializar el sonido de hover
  useEffect(() => {
    hoverSoundRef.current = new Howl({
      src: ['/sonidos/Sonido_lijado_cucharas.m4a'],
      volume: 0.5,
      preload: true,
    });

    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      hoverSoundRef.current?.unload();
    };
  }, []);

  // Función para inicializar el audio después de la primera interacción
  const initializeAudio = useCallback(() => {
    if (!isAudioInitialized.current && hoverSoundRef.current) {
      // Reproducir y pausar inmediatamente para "desbloquear" el audio
      hoverSoundRef.current.play();
      hoverSoundRef.current.stop();
      isAudioInitialized.current = true;
    }
  }, []);

  // Función para reproducir el sonido con transición suave
  const playHoverSound = useCallback(() => {
    // Inicializar audio si es necesario
    if (!isAudioInitialized.current) {
      initializeAudio();
    }

    if (hoverSoundRef.current) {
      // Limpiar timeout anterior si existe
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }

      // Si ya está sonando, hacer fade out rápido antes de reiniciar
      if (hoverSoundRef.current.playing()) {
        hoverSoundRef.current.fade(hoverSoundRef.current.volume(), 0, 150);
        setTimeout(() => {
          if (hoverSoundRef.current) {
            hoverSoundRef.current.stop();
            hoverSoundRef.current.volume(0.5);
            hoverSoundRef.current.play();
          }
        }, 150);
      } else {
        // Si no está sonando, reproducir directamente
        hoverSoundRef.current.volume(0.5);
        hoverSoundRef.current.play();
      }

      // Hacer fade out después de 2.5 segundos y detener después de 3 segundos
      fadeTimeoutRef.current = window.setTimeout(() => {
        if (hoverSoundRef.current && hoverSoundRef.current.playing()) {
          hoverSoundRef.current.fade(0.5, 0, 500);
          setTimeout(() => {
            hoverSoundRef.current?.stop();
          }, 500);
        }
      }, 2500);
    }
  }, [initializeAudio]);

  // Función para detener el sonido inmediatamente cuando sale del hover
  const stopHoverSound = useCallback(() => {
    if (hoverSoundRef.current) {
      // Limpiar timeout de fade si existe
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }

      // Detener el sonido inmediatamente
      hoverSoundRef.current.stop();
    }
  }, []);

  // Distribuir artesanas radialmente
  const worldArtesanas = useMemo(() => {
    return distributeRadially(rawArtesanas);
  }, [rawArtesanas]);

  // Filtrar artesanas
  const filteredArtesanas = useMemo(() => {
    return worldArtesanas.filter((artesana) => {
      if (selectedDisciplina && artesana.disciplina !== selectedDisciplina) {
        return false;
      }
      if (selectedRegion && artesana.region !== selectedRegion) {
        return false;
      }
      return true;
    });
  }, [worldArtesanas, selectedDisciplina, selectedRegion]);

  // Centrar vista inicial
  useEffect(() => {
    if (containerRef.current && filteredArtesanas.length > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      setViewState({
        x: WORLD_DIMENSIONS.width / 2 - rect.width / 2.5,
        y: WORLD_DIMENSIONS.height / 2 - rect.height / 2.5,
        scale: 1,
      });
      // Marcar como inicializado para habilitar cursor
      setIsInitialized(true);
    }
  }, [filteredArtesanas.length]);

  // Transformación mundo → pantalla
  const worldToScreen = useCallback(
    (worldX: number, worldY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };

      return {
        x: (worldX - viewState.x) * viewState.scale,
        y: (worldY - viewState.y) * viewState.scale,
      };
    },
    [viewState]
  );

  // Puntos con coordenadas de pantalla
  const screenArtesanas = useMemo(() => {
    return filteredArtesanas.map((artesana) => {
      const screenPos = worldToScreen(artesana.x, artesana.y);
      return {
        ...artesana,
        screenX: screenPos.x,
        screenY: screenPos.y,
      };
    });
  }, [filteredArtesanas, worldToScreen]);

  // Handlers de drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      initializeAudio(); // Inicializar audio en la primera interacción
      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startViewX: viewState.x,
        startViewY: viewState.y,
      });
    },
    [viewState, initializeAudio]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      setViewState((prev) => ({
        ...prev,
        x: dragState.startViewX - deltaX / prev.scale,
        y: dragState.startViewY - deltaY / prev.scale,
      }));
    },
    [dragState]
  );

  const handleMouseUp = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  // Handlers táctiles
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setDragState({
          isDragging: true,
          startX: touch.clientX,
          startY: touch.clientY,
          startViewX: viewState.x,
          startViewY: viewState.y,
        });
      }
    },
    [viewState]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragState.isDragging || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - dragState.startX;
      const deltaY = touch.clientY - dragState.startY;

      setViewState((prev) => ({
        ...prev,
        x: dragState.startViewX - deltaX / prev.scale,
        y: dragState.startViewY - deltaY / prev.scale,
      }));
    },
    [dragState]
  );

  const handleTouchEnd = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  // Funciones de zoom con botones
  const handleZoomIn = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const worldPoint = {
      x: centerX / viewState.scale + viewState.x,
      y: centerY / viewState.scale + viewState.y,
    };

    const newScale = Math.min(
      ZOOM_LEVELS.max,
      viewState.scale + ZOOM_LEVELS.step
    );

    setViewState({
      scale: newScale,
      x: worldPoint.x - centerX / newScale,
      y: worldPoint.y - centerY / newScale,
    });
  }, [viewState]);

  const handleZoomOut = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const worldPoint = {
      x: centerX / viewState.scale + viewState.x,
      y: centerY / viewState.scale + viewState.y,
    };

    const newScale = Math.max(
      ZOOM_LEVELS.min,
      viewState.scale - ZOOM_LEVELS.step
    );

    setViewState({
      scale: newScale,
      x: worldPoint.x - centerX / newScale,
      y: worldPoint.y - centerY / newScale,
    });
  }, [viewState]);

  // Reset view
  const handleResetView = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setViewState({
      x: WORLD_DIMENSIONS.width / 2 - rect.width / 2,
      y: WORLD_DIMENSIONS.height / 2 - rect.height / 2,
      scale: 1,
    });
  }, []);

  // Click en artesana
  const handleArtesanaClick = useCallback(
    (artesana: Artesana) => {
      if (!dragState.isDragging) {
        setSelectedArtesana(artesana);
      }
    },
    [dragState.isDragging]
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500">
      {/* Fondo con estrellas */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 2 + 0.5}
              fill="white"
              opacity={Math.random() * 0.5 + 0.3}
            />
          ))}
        </svg>
      </div>

      {/* Contenedor del mapa */}
      <div
        ref={containerRef}
        className={`absolute inset-0 ${
          isInitialized
            ? dragState.isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Puntos de artesanas */}
        <AnimatePresence>
          {screenArtesanas.map((artesana, index) => (
            <motion.div
              key={artesana.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: artesana.opacity,
                scale: artesana.scale,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              style={{
                position: 'absolute',
                left: artesana.screenX,
                top: artesana.screenY,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.3 }}
                onMouseEnter={playHoverSound}
                onMouseLeave={stopHoverSound}
                onClick={() => handleArtesanaClick(artesana)}
                className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
              >
                {/* Anillo pulsante */}
                <div className="absolute inset-0 -m-6 rounded-full border-2 border-white/60 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping" />
                <div className="absolute inset-0 -m-3 rounded-full border border-white/80 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse" />

                {/* Punto principal con color de la paleta */}
                <div
                  className="relative w-4 h-4 rounded-full shadow-lg"
                  style={{
                    background: artesana.color,
                    boxShadow: `0 0 10px ${artesana.color}80`,
                  }}
                />

                {/* Tooltip */}
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="font-semibold">{artesana.nombre}</div>
                  <div className="text-xs text-gray-300">
                    {artesana.disciplina}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Líneas de conexión - conectar puntos cercanos en el espacio */}
        {filteredArtesanas.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
              </linearGradient>
            </defs>
            {/* Conectar todos los puntos que estén cerca entre sí */}
            {filteredArtesanas.flatMap((artesana, i) =>
              filteredArtesanas
                .slice(i + 1)
                .filter((other) => {
                  const dx = artesana.x - other.x;
                  const dy = artesana.y - other.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  return distance < 600; // Umbral aumentado para conectar más puntos
                })
                .map((other, j) => {
                  const screenPos1 = worldToScreen(artesana.x, artesana.y);
                  const screenPos2 = worldToScreen(other.x, other.y);
                  return (
                    <line
                      key={`line-${i}-${j}`}
                      x1={screenPos1.x}
                      y1={screenPos1.y}
                      x2={screenPos2.x}
                      y2={screenPos2.y}
                      stroke="url(#lineGradient)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeOpacity="0.4"
                    />
                  );
                })
            )}
          </svg>
        )}
      </div>

      {/* Controles de zoom */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          disabled={viewState.scale >= ZOOM_LEVELS.max}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomIn className="w-6 h-6 text-gray-800" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          disabled={viewState.scale <= ZOOM_LEVELS.min}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomOut className="w-6 h-6 text-gray-800" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetView}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
        >
          <Maximize2 className="w-6 h-6 text-gray-800" />
        </motion.button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-6 space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
        >
          <p className="text-sm font-medium">
            <span className="text-purple-600 font-bold">
              {filteredArtesanas.length}
            </span>
            <span className="text-gray-600"> artesanas</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
        >
          <p className="text-xs text-gray-600">
            Zoom: {Math.round(viewState.scale * 100)}%
          </p>
        </motion.div>
      </div>

      {/* Modal de artesana - Usando componente original */}
      <ArtesanaModal
        artesana={selectedArtesana}
        onClose={() => setSelectedArtesana(null)}
      />
    </div>
  );
}
