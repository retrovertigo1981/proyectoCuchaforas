// Versión mejorada con navegación drag funcional y filtros animados
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConstellationPoint } from './CostellationPoint';
import { ArtesanaModal } from './ArtesanaModal';
import type { Artesana } from '@/data/artesanas';
import { artesanas, disciplinas, regiones } from '@/data/artesanas';

interface WorldArtesana extends Artesana {
  x: number;
  y: number;
  screenX: number;
  screenY: number;
  targetX: number;
  targetY: number;
  opacity: number;
  scale: number;
}

interface ViewState {
  x: number;
  y: number;
  scale: number;
}

interface FilterState {
  disciplina: string | null;
  region: string | null;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startViewX: number;
  startViewY: number;
}

// Dimensiones del mundo virtual
const WORLD_DIMENSIONS = {
  width: 4000,
  height: 3000,
};

export const ConstellationMapV3: React.FC = () => {
  // Estados principales
  const [selectedArtesana, setSelectedArtesana] = useState<Artesana | null>(
    null
  );
  const [viewState, setViewState] = useState<ViewState>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [filters, setFilters] = useState<FilterState>({
    disciplina: null,
    region: null,
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startViewX: 0,
    startViewY: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Generar posiciones en el mundo virtual (más concentradas hacia el centro)
  const worldArtesanas = useMemo<WorldArtesana[]>(() => {
    return artesanas.map((artesana, index) => {
      // Sistema de distribución radial concéntrica
      const rings = Math.ceil(Math.sqrt(artesanas.length)); // Número de anillos necesarios
      const ring = Math.floor(index / (artesanas.length / rings)) + 1; // Anillo actual (1, 2, 3...)

      // Radio base más pequeño que crece gradualmente
      const baseRadius = 300; // Radio inicial más pequeño
      const ringSpacing = 200; // Espaciado entre anillos
      const maxRadius = baseRadius + (ring - 1) * ringSpacing;

      // Distribución aleatoria dentro del anillo
      const randomRadius =
        Math.random() * (maxRadius - baseRadius) + baseRadius;
      const angle =
        (index / artesanas.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.5; // Variación aleatoria en el ángulo

      const x = WORLD_DIMENSIONS.width / 2 + Math.cos(angle) * randomRadius;
      const y = WORLD_DIMENSIONS.height / 2 + Math.sin(angle) * randomRadius;

      return {
        ...artesana,
        x,
        y,
        screenX: 0,
        screenY: 0,
        targetX: x,
        targetY: y,
        opacity: 1,
        scale: 1,
      };
    });
  }, []);

  // Filtrar artesanas basado en filtros activos
  const filteredArtesanas = useMemo(() => {
    return worldArtesanas.filter((artesana) => {
      if (filters.disciplina && artesana.disciplina !== filters.disciplina) {
        return false;
      }
      if (filters.region && artesana.region !== filters.region) {
        return false;
      }
      return true;
    });
  }, [worldArtesanas, filters]);

  // Aplicar filtros con animación
  const applyFilters = useCallback(
    (newFilters: FilterState) => {
      setIsFiltering(true);

      // Calcular nuevas posiciones basadas en los filtros
      const groupedArtesanas = new Map<string, WorldArtesana[]>();

      filteredArtesanas.forEach((artesana) => {
        const group = artesana.disciplina; // Agrupar por disciplina
        if (!groupedArtesanas.has(group)) {
          groupedArtesanas.set(group, []);
        }
        groupedArtesanas.get(group)!.push(artesana);
      });

      // Reorganizar posiciones con animaciones
      const updatedArtesanas = worldArtesanas.map((artesana, index) => {
        const isVisible = filteredArtesanas.includes(artesana);

        if (isVisible) {
          // Posiciones visibles en una disposición organizada
          const groupIndex = Array.from(groupedArtesanas.keys()).indexOf(
            artesana.disciplina
          );
          const indexInGroup = groupedArtesanas
            .get(artesana.disciplina)!
            .indexOf(artesana);
          const groupSize = groupedArtesanas.get(artesana.disciplina)!.length;

          const groupSpacing = 200;
          const itemSpacing = 80;

          const groupCenterX =
            WORLD_DIMENSIONS.width / 2 + (groupIndex - 2) * groupSpacing;
          const groupCenterY = WORLD_DIMENSIONS.height / 2;

          const row = Math.floor(indexInGroup / 4);
          const col = indexInGroup % 4;

          const targetX = groupCenterX + (col - 1.5) * itemSpacing;
          const targetY =
            groupCenterY + (row - Math.floor(groupSize / 8)) * itemSpacing;

          return {
            ...artesana,
            targetX,
            targetY,
            opacity: 1,
            scale: 1,
          };
        } else {
          // Puntos invisibles se mueven hacia fuera
          return {
            ...artesana,
            targetX: artesana.x,
            targetY: artesana.y,
            opacity: 0,
            scale: 0.5,
          };
        }
      });

      setFilters(newFilters);

      // Simular posición actual hacia objetivo (en una implementación real, esto sería animado)
      setTimeout(() => setIsFiltering(false), 500);

      return updatedArtesanas;
    },
    [filteredArtesanas, worldArtesanas]
  );

  // Función de transformación mundo → pantalla
  const worldToScreen = useCallback(
    (worldX: number, worldY: number) => {
      return {
        x: (worldX - viewState.x) * viewState.scale,
        y: (worldY - viewState.y) * viewState.scale,
      };
    },
    [viewState]
  );

  // Puntos con coordenadas de pantalla actualizadas
  const screenArtesanas = useMemo(() => {
    return filteredArtesanas.map((artesana) => {
      const screenPos = worldToScreen(artesana.targetX, artesana.targetY);
      return {
        ...artesana,
        screenX: screenPos.x,
        screenY: screenPos.y,
      };
    });
  }, [filteredArtesanas, worldToScreen]);

  // Handlers de navegación
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

  // Zoom con scroll
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldPoint = {
        x: mouseX / viewState.scale + viewState.x,
        y: mouseY / viewState.scale + viewState.y,
      };

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(3, viewState.scale * delta));

      // Ajustar posición para mantener el mouse como punto focal
      const newViewX = worldPoint.x - mouseX / newScale;
      const newViewY = worldPoint.y - mouseY / newScale;

      setViewState((prev) => ({
        ...prev,
        scale: newScale,
        x: newViewX,
        y: newViewY,
      }));
    },
    [viewState]
  );

  // Reset view con doble click
  const handleDoubleClick = useCallback(() => {
    setViewState({ x: 0, y: 0, scale: 1 });
  }, []);

  // Handlers táctiles para móviles
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
      e.preventDefault();
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

  // Función para obtener artesana más cercana
  const getNearestArtesana = useCallback(
    (worldX: number, worldY: number) => {
      const maxDistance = 50 / viewState.scale; // Radio de click escalado

      return filteredArtesanas.find((artesana) => {
        const distance = Math.sqrt(
          Math.pow(artesana.targetX - worldX, 2) +
            Math.pow(artesana.targetY - worldY, 2)
        );
        return distance < maxDistance;
      });
    },
    [filteredArtesanas, viewState.scale]
  );

  // Click handler para seleccionar artesanas
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || dragState.isDragging) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const worldX = clickX / viewState.scale + viewState.x;
      const worldY = clickY / viewState.scale + viewState.y;

      const clickedArtesana = getNearestArtesana(worldX, worldY);
      if (clickedArtesana) {
        setSelectedArtesana(clickedArtesana);
      }
    },
    [dragState.isDragging, viewState, getNearestArtesana]
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#656293] via-[#7a7ab8] to-[#9695c3]">
      {/* Fondo con constelación */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${-viewState.x * 0.3}px, ${-viewState.y * 0.3}px) scale(${1 + (viewState.scale - 1) * 0.2})`,
        }}
      >
        <SpoonConstellation />
      </div>

      {/* Container principal del mapa */}
      <div
        ref={containerRef}
        className={`absolute inset-0 ${dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {/* Puntos de artesanas con animaciones */}
        <AnimatePresence>
          {screenArtesanas.map((artesana, index) => (
            <motion.div
              key={artesana.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: artesana.opacity,
                scale: artesana.scale,
                x: artesana.screenX,
                y: artesana.screenY,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: isFiltering ? 0.5 : 0.3,
                delay: isFiltering ? index * 0.02 : 0,
              }}
              style={{
                position: 'absolute',
                left: artesana.screenX,
                top: artesana.screenY,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <ConstellationPoint
                artesana={artesana}
                onClick={() => setSelectedArtesana(artesana)}
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Líneas de conexión */}
        {filteredArtesanas.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
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
              const screenPos1 = worldToScreen(
                artesana.targetX,
                artesana.targetY
              );
              const screenPos2 = worldToScreen(
                nextArtesana.targetX,
                nextArtesana.targetY
              );

              return (
                <motion.line
                  key={`line-${i}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isFiltering ? 0 : 0.4 }}
                  transition={{ duration: 1, delay: i * 0.15 }}
                  x1={screenPos1.x}
                  y1={screenPos1.y}
                  x2={screenPos2.x}
                  y2={screenPos2.y}
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* Panel de filtros */}
      <div className="absolute top-6 left-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border max-w-sm"
        >
          <h3 className="text-sm font-semibold mb-3">Filtrar Artesanas</h3>

          {/* Filtro por disciplina */}
          <div className="mb-3">
            <label className="text-xs text-muted-foreground block mb-1">
              Disciplina
            </label>
            <select
              value={filters.disciplina || ''}
              onChange={(e) =>
                applyFilters({ ...filters, disciplina: e.target.value || null })
              }
              className="w-full text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas las disciplinas</option>
              {disciplinas.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por región */}
          <div className="mb-3">
            <label className="text-xs text-muted-foreground block mb-1">
              Región
            </label>
            <select
              value={filters.region || ''}
              onChange={(e) =>
                applyFilters({ ...filters, region: e.target.value || null })
              }
              className="w-full text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas las regiones</option>
              {regiones.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Reset filters */}
          {(filters.disciplina || filters.region) && (
            <button
              onClick={() => applyFilters({ disciplina: null, region: null })}
              className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded hover:bg-destructive/90 transition-colors"
            >
              Limpiar filtros
            </button>
          )}

          {/* Contador */}
          <div className="text-xs text-muted-foreground mt-2">
            {filteredArtesanas.length} de {worldArtesanas.length} artesanas
          </div>
        </motion.div>
      </div>

      {/* Indicadores en la esquina inferior izquierda */}
      <div className="absolute bottom-6 left-6 space-y-2">
        {/* Contador de artesanas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-background/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border"
        >
          <p className="text-sm font-medium">
            <span className="text-primary font-bold">
              {filteredArtesanas.length}
            </span>
            <span className="text-muted-foreground"> artesanas</span>
          </p>
        </motion.div>

        {/* Indicador de zoom */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border"
        >
          <p className="text-xs text-muted-foreground">
            Zoom: {Math.round(viewState.scale * 100)}%
          </p>
        </motion.div>

        {/* Instrucciones */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border max-w-xs"
        >
          <p className="text-xs text-muted-foreground">
            💡 Arrastra para mover, scroll para zoom, doble-click para resetear
          </p>
        </motion.div>
      </div>

      {/* Indicador de filtrado */}
      {isFiltering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border"
        >
          <p className="text-sm font-medium">Reorganizando...</p>
        </motion.div>
      )}

      {/* Modal de artesana */}
      <AnimatePresence>
        {selectedArtesana && (
          <ArtesanaModal
            artesana={selectedArtesana}
            onClose={() => setSelectedArtesana(null)}
          />
        )}
      </AnimatePresence>
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
      className="w-full h-full opacity-60"
    >
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>
      </defs>

      {/* Estrellas principales formando silueta de cuchara */}
      {[
        // Mango
        { x: 50, y: 150, size: 2, opacity: 0.8 },
        { x: 80, y: 120, size: 2.2, opacity: 0.9 },
        { x: 100, y: 100, size: 2.5, opacity: 1 },
        { x: 120, y: 90, size: 2, opacity: 0.8 },
        { x: 160, y: 80, size: 2.1, opacity: 0.8 },

        // Bowl
        { x: 200, y: 70, size: 2.3, opacity: 0.9 },
        { x: 240, y: 85, size: 2.2, opacity: 0.9 },
        { x: 280, y: 110, size: 1.8, opacity: 0.7 },
        { x: 320, y: 140, size: 2.2, opacity: 0.9 },
        { x: 350, y: 155, size: 1.7, opacity: 0.7 },
      ].map((star, index) => (
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
        {[
          { x1: 50, y1: 150, x2: 80, y2: 120 },
          { x1: 80, y1: 120, x2: 100, y2: 100 },
          { x1: 100, y1: 100, x2: 120, y2: 90 },
          { x1: 120, y1: 90, x2: 160, y2: 80 },
          { x1: 160, y1: 80, x2: 200, y2: 70 },
          { x1: 200, y1: 70, x2: 240, y2: 85 },
          { x1: 240, y1: 85, x2: 280, y2: 110 },
          { x1: 280, y1: 110, x2: 320, y2: 140 },
          { x1: 320, y1: 140, x2: 350, y2: 155 },
        ].map((line, index) => (
          <motion.line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
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

export default ConstellationMapV3;
