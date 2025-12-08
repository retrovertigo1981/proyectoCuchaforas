import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
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

// Colores por disciplina
const disciplinaColors: Record<string, string> = {
  Cerámica: 'from-red-400 to-red-600',
  Textil: 'from-purple-400 to-purple-600',
  Madera: 'from-yellow-500 to-yellow-700',
  Cestería: 'from-orange-400 to-orange-600',
  Orfebrería: 'from-yellow-300 to-yellow-500',
  Tejido: 'from-indigo-400 to-indigo-600',
};

// Función para distribuir artesanas radialmente
const distributeRadially = (
  artesanas: BasicArtesanaType[],
  totalCapacity = 365
): Artesana[] => {
  const centerX = WORLD_DIMENSIONS.width / 2;
  const centerY = WORLD_DIMENSIONS.height / 2;

  // Configuración de anillos concéntricos
  const maxRadius =
    Math.min(WORLD_DIMENSIONS.width, WORLD_DIMENSIONS.height) * 0.4;
  const numRings = Math.ceil(Math.sqrt(totalCapacity / Math.PI));
  const pointsPerRing = Math.ceil(artesanas.length / numRings);

  return artesanas.map((artesana, index) => {
    // Determinar en qué anillo va este punto
    const ringIndex = Math.floor(index / pointsPerRing);
    const positionInRing = index % pointsPerRing;
    const totalInRing = Math.min(
      pointsPerRing,
      artesanas.length - ringIndex * pointsPerRing
    );

    // Radio del anillo (crece de forma más suave)
    const ringProgress = ringIndex / Math.max(numRings - 1, 1);
    const radius =
      maxRadius * Math.pow(ringProgress, 0.7) * (0.3 + Math.random() * 0.4);

    // Ángulo con variación aleatoria
    const baseAngle = (positionInRing / totalInRing) * 2 * Math.PI;
    const angleVariation = (Math.random() - 0.5) * 0.3;
    const angle = baseAngle + angleVariation;

    // Posición final
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    return {
      ...artesana,
      x,
      y,
      screenX: 0,
      screenY: 0,
      opacity: 1,
      scale: 1,
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

  const containerRef = useRef<HTMLDivElement>(null);

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
        x: WORLD_DIMENSIONS.width / 2 - rect.width / 2,
        y: WORLD_DIMENSIONS.height / 2 - rect.height / 2,
        scale: 1,
      });
    }
  }, []);

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
      setDragState({
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startViewX: viewState.x,
        startViewY: viewState.y,
      });
    },
    [viewState]
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
        className={`absolute inset-0 ${dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                onClick={() => handleArtesanaClick(artesana)}
                className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
              >
                {/* Halo exterior */}
                <div className="absolute inset-0 -m-4 rounded-full bg-white/20 blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Punto principal */}
                <div
                  className={`relative w-4 h-4 rounded-full bg-gradient-to-br ${
                    disciplinaColors[artesana.disciplina] ||
                    'from-white to-gray-300'
                  } shadow-lg`}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="font-semibold">{artesana.nombre}</div>
                  <div className="text-xs text-gray-300">
                    {artesana.disciplina}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Líneas de conexión */}
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
            {filteredArtesanas.slice(0, -1).map((artesana, i) => {
              const nextArtesana = filteredArtesanas[i + 1];
              const screenPos1 = worldToScreen(artesana.x, artesana.y);
              const screenPos2 = worldToScreen(nextArtesana.x, nextArtesana.y);
              const distance = Math.sqrt(
                Math.pow(artesana.x - nextArtesana.x, 2) +
                  Math.pow(artesana.y - nextArtesana.y, 2)
              );

              // Solo dibujar líneas entre puntos cercanos
              if (distance < 300) {
                return (
                  <line
                    key={`line-${i}`}
                    x1={screenPos1.x}
                    y1={screenPos1.y}
                    x2={screenPos2.x}
                    y2={screenPos2.y}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              }
              return null;
            })}
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
