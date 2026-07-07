import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Howl } from 'howler';
import type { Artesana as BasicArtesanaType } from '@/data/artesanas';
import mapaTopografico from '@/assets/img/mapa_topografico_cuchaforas.svg';

interface Artesana extends BasicArtesanaType {
  x: number;
  y: number;
  color: string;
}

interface ViewState {
  x: number;
  y: number;
  scale: number;
}

interface ConstellationMapProps {
  artesanas: BasicArtesanaType[];
  selectedDisciplina?: string | null;
  selectedRegion?: string | null;
}

const WORLD_DIMENSIONS = { width: 3000, height: 3000 };
const ZOOM_LEVELS = { min: 0.3, max: 2.5, step: 0.2 };
const POINT_RADIUS = 8;
const HIT_RADIUS = 20;
const CONNECTION_DISTANCE = 600;

const COLOR_PALETTE = [
  '#7e7bab', '#ffd633', '#9695c3', '#656293', '#bab8dd', '#feca17',
  '#b28710', '#d9a906', '#ef7b6f', '#e7312b', '#cb281a', '#ea5a4c',
];

const getColorForArtesana = (artesanaId: string): string => {
  let hash = 0;
  for (let i = 0; i < artesanaId.length; i++) {
    hash = artesanaId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
};

const distributeRadially = (artesanas: BasicArtesanaType[]): Artesana[] => {
  const centerX = WORLD_DIMENSIONS.width / 2;
  const centerY = WORLD_DIMENSIONS.height / 2;
  const count = artesanas.length;
  const baseRadius = 400;
  const extraRadius = Math.sqrt(count) * 80;
  const maxRadius = baseRadius + extraRadius;
  const numRings = Math.max(1, Math.ceil(Math.sqrt(count / Math.PI)));
  const pointsPerRing = Math.ceil(count / numRings);

  return artesanas.map((artesana, index) => {
    const ringIndex = Math.floor(index / pointsPerRing);
    const positionInRing = index % pointsPerRing;
    const totalInRing = Math.min(pointsPerRing, artesanas.length - ringIndex * pointsPerRing);
    const ringProgress = Math.pow(ringIndex / Math.max(numRings - 1, 1), 0.7);
    const minRingSpacing = 120;
    const radius = minRingSpacing + (maxRadius - minRingSpacing) * ringProgress * (0.9 + Math.random() * 0.2);
    const baseAngle = (positionInRing / totalInRing) * 2 * Math.PI;
    const angleVariation = (Math.random() - 0.5) * 0.8;
    const angle = baseAngle + angleVariation;

    return {
      ...artesana,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      color: getColorForArtesana(artesana.id),
    };
  });
};

export default function ConstellationMapImproved({
  artesanas: rawArtesanas,
  selectedDisciplina,
  selectedRegion,
}: ConstellationMapProps) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const hoverSoundRef = useRef<Howl | null>(null);
  const isAudioInitialized = useRef(false);
  const lastHoveredRef = useRef<string | null>(null);
  const pulsePhaseRef = useRef(0);

  const [viewState, setViewState] = useState<ViewState>({
    x: WORLD_DIMENSIONS.width / 2,
    y: WORLD_DIMENSIONS.height / 2,
    scale: 1,
  });
  const [hoveredArtesana, setHoveredArtesana] = useState<Artesana | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startViewX: 0,
    startViewY: 0,
    hasMoved: false,
  });

  const pinchRef = useRef({
    isPinching: false,
    startDistance: 0,
    startScale: 1,
  });

  useEffect(() => {
    hoverSoundRef.current = new Howl({
      src: ['/sonidos/Sonido_lijado_cucharas.m4a'],
      volume: 0.5,
      preload: true,
    });
    return () => { hoverSoundRef.current?.unload(); };
  }, []);

  const initializeAudio = useCallback(() => {
    if (!isAudioInitialized.current && hoverSoundRef.current) {
      hoverSoundRef.current.play();
      hoverSoundRef.current.stop();
      isAudioInitialized.current = true;
    }
  }, []);

  const playHoverSound = useCallback(() => {
    if (!isAudioInitialized.current) initializeAudio();
    if (hoverSoundRef.current && !hoverSoundRef.current.playing()) {
      hoverSoundRef.current.volume(0.5);
      hoverSoundRef.current.play();
    }
  }, [initializeAudio]);

  const stopHoverSound = useCallback(() => {
    if (hoverSoundRef.current && hoverSoundRef.current.playing()) {
      hoverSoundRef.current.fade(0.5, 0, 150);
      setTimeout(() => {
        hoverSoundRef.current?.stop();
      }, 150);
    }
  }, []);

  const worldArtesanas = useMemo(() => distributeRadially(rawArtesanas), [rawArtesanas]);

  const filteredArtesanas = useMemo(() => {
    return worldArtesanas.filter((a) => {
      if (selectedDisciplina && a.disciplina !== selectedDisciplina) return false;
      if (selectedRegion && a.region !== selectedRegion) return false;
      return true;
    });
  }, [worldArtesanas, selectedDisciplina, selectedRegion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ width, height });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0 && filteredArtesanas.length > 0) {
      setViewState({
        x: WORLD_DIMENSIONS.width / 2 - canvasSize.width / 2,
        y: WORLD_DIMENSIONS.height / 2 - canvasSize.height / 2,
        scale: 1,
      });
      setIsInitialized(true);
    }
  }, [canvasSize.width, canvasSize.height, filteredArtesanas.length]);

  const worldToScreen = useCallback(
    (worldX: number, worldY: number) => ({
      x: (worldX - viewState.x) * viewState.scale,
      y: (worldY - viewState.y) * viewState.scale,
    }),
    [viewState]
  );

  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => ({
      x: screenX / viewState.scale + viewState.x,
      y: screenY / viewState.scale + viewState.y,
    }),
    [viewState]
  );

  const findArtesanaAtPosition = useCallback(
    (screenX: number, screenY: number): Artesana | null => {
      const worldPos = screenToWorld(screenX, screenY);
      const hitRadiusWorld = HIT_RADIUS / viewState.scale;

      for (const artesana of filteredArtesanas) {
        const dx = artesana.x - worldPos.x;
        const dy = artesana.y - worldPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < hitRadiusWorld) return artesana;
      }
      return null;
    },
    [filteredArtesanas, screenToWorld, viewState.scale]
  );

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    pulsePhaseRef.current = (pulsePhaseRef.current + 0.02) % (Math.PI * 2);
    const pulseScale = 1 + Math.sin(pulsePhaseRef.current) * 0.15;

    const visibleArtesanas = filteredArtesanas.filter((a) => {
      const screen = worldToScreen(a.x, a.y);
      const margin = 50;
      return (
        screen.x >= -margin &&
        screen.x <= canvasSize.width + margin &&
        screen.y >= -margin &&
        screen.y <= canvasSize.height + margin
      );
    });

    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#1a0a00';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';

    for (let i = 0; i < visibleArtesanas.length; i++) {
      const a = visibleArtesanas[i];
      const screenA = worldToScreen(a.x, a.y);

      for (let j = i + 1; j < visibleArtesanas.length; j++) {
        const b = visibleArtesanas[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONNECTION_DISTANCE) {
          const screenB = worldToScreen(b.x, b.y);
          ctx.beginPath();
          ctx.moveTo(screenA.x, screenA.y);
          ctx.lineTo(screenB.x, screenB.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;

    for (const artesana of visibleArtesanas) {
      const screen = worldToScreen(artesana.x, artesana.y);
      const isHovered = hoveredArtesana?.id === artesana.id;
      const radius = POINT_RADIUS * viewState.scale * (isHovered ? 1.3 * pulseScale : 1);

      if (isHovered) {
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius * 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius * 1.8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const gradient = ctx.createRadialGradient(
        screen.x, screen.y, 0,
        screen.x, screen.y, radius * 2
      );
      gradient.addColorStop(0, artesana.color);
      gradient.addColorStop(0.5, artesana.color + '80');
      gradient.addColorStop(1, artesana.color + '00');

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = artesana.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    animationFrameRef.current = requestAnimationFrame(render);
  }, [canvasSize, filteredArtesanas, hoveredArtesana, viewState, worldToScreen]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [render]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      initializeAudio();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (e.pointerType === 'touch' && e.isPrimary === false) {
        return;
      }

      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startViewX: viewState.x,
        startViewY: viewState.y,
        hasMoved: false,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [viewState, initializeAudio]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      if (dragRef.current.isDragging) {
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;

        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
          dragRef.current.hasMoved = true;
        }

        setViewState((prev) => ({
          ...prev,
          x: dragRef.current.startViewX - deltaX / prev.scale,
          y: dragRef.current.startViewY - deltaY / prev.scale,
        }));
        setHoveredArtesana(null);
        return;
      }

      const artesana = findArtesanaAtPosition(localX, localY);
      if (artesana) {
        if (lastHoveredRef.current !== artesana.id) {
          lastHoveredRef.current = artesana.id;
          playHoverSound();
        }
        setHoveredArtesana(artesana);
        const screen = worldToScreen(artesana.x, artesana.y);
        setTooltipPos({ x: screen.x, y: screen.y });
      } else {
        if (lastHoveredRef.current !== null) {
          stopHoverSound();
        }
        lastHoveredRef.current = null;
        setHoveredArtesana(null);
      }
    },
    [findArtesanaAtPosition, playHoverSound, stopHoverSound, worldToScreen]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.hasMoved && !dragRef.current.isDragging) return;

      if (!dragRef.current.hasMoved) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        const artesana = findArtesanaAtPosition(localX, localY);
        if (artesana) {
          navigate(`/creadoras/${artesana.id}`);
        }
      }

      dragRef.current.isDragging = false;
    },
    [findArtesanaAtPosition, navigate]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchRef.current = {
          isPinching: true,
          startDistance: Math.sqrt(dx * dx + dy * dy),
          startScale: viewState.scale,
        };
      }
    },
    [viewState.scale]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current.isPinching) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scaleRatio = distance / pinchRef.current.startDistance;
        const newScale = Math.max(
          ZOOM_LEVELS.min,
          Math.min(ZOOM_LEVELS.max, pinchRef.current.startScale * scaleRatio)
        );
        setViewState((prev) => ({ ...prev, scale: newScale }));
      }
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    pinchRef.current.isPinching = false;
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldPoint = screenToWorld(mouseX, mouseY);

      const delta = e.deltaY > 0 ? -ZOOM_LEVELS.step : ZOOM_LEVELS.step;
      const newScale = Math.max(ZOOM_LEVELS.min, Math.min(ZOOM_LEVELS.max, viewState.scale + delta));

      setViewState({
        scale: newScale,
        x: worldPoint.x - mouseX / newScale,
        y: worldPoint.y - mouseY / newScale,
      });
    },
    [viewState.scale, screenToWorld]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleMouseLeave = useCallback(() => {
    setHoveredArtesana(null);
    stopHoverSound();
  }, [stopHoverSound]);

  const handleZoomIn = useCallback(() => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const worldPoint = screenToWorld(centerX, centerY);
    const newScale = Math.min(ZOOM_LEVELS.max, viewState.scale + ZOOM_LEVELS.step);
    setViewState({ scale: newScale, x: worldPoint.x - centerX / newScale, y: worldPoint.y - centerY / newScale });
  }, [canvasSize, screenToWorld, viewState.scale]);

  const handleZoomOut = useCallback(() => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const worldPoint = screenToWorld(centerX, centerY);
    const newScale = Math.max(ZOOM_LEVELS.min, viewState.scale - ZOOM_LEVELS.step);
    setViewState({ scale: newScale, x: worldPoint.x - centerX / newScale, y: worldPoint.y - centerY / newScale });
  }, [canvasSize, screenToWorld, viewState.scale]);

  const handleResetView = useCallback(() => {
    setViewState({
      x: WORLD_DIMENSIONS.width / 2 - canvasSize.width / 2,
      y: WORLD_DIMENSIONS.height / 2 - canvasSize.height / 2,
      scale: 1,
    });
  }, [canvasSize]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#634b08]">
      <img
        src={mapaTopografico}
        alt="Mapa Topográfico Cuchaforas"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        loading="lazy"
      />

      <div
        ref={containerRef}
        className={`absolute inset-0 ${isInitialized ? (dragRef.current.isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseLeave={handleMouseLeave}
        role="application"
        aria-label="Mapa de constelación de artesanas. Arrastra para mover, usa Ctrl + scroll para zoom. Haz click en un punto para ver detalles."
      >
        <canvas
          ref={canvasRef}
          style={{ width: canvasSize.width, height: canvasSize.height }}
          className="pointer-events-none"
        />
      </div>

      {hoveredArtesana && (
        <div
          className="absolute z-50 pointer-events-none px-3 py-2 bg-black/90 text-white text-sm rounded-lg backdrop-blur-sm"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 60,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold whitespace-nowrap">{hoveredArtesana.nombre}</div>
          <div className="text-xs text-gray-300 whitespace-nowrap">{hoveredArtesana.disciplina}</div>
        </div>
      )}

      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          disabled={viewState.scale >= ZOOM_LEVELS.max}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Acercar"
        >
          <ZoomIn className="w-6 h-6 text-gray-800" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          disabled={viewState.scale <= ZOOM_LEVELS.min}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Alejar"
        >
          <ZoomOut className="w-6 h-6 text-gray-800" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetView}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Resetear vista"
        >
          <Maximize2 className="w-6 h-6 text-gray-800" />
        </motion.button>
      </div>

      <div className="absolute bottom-6 left-6 space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
        >
          <p className="text-sm font-medium">
            <span className="text-purple-600 font-bold">{filteredArtesanas.length}</span>
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

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hidden sm:block"
        >
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px] font-mono font-semibold text-gray-700">Ctrl</kbd>
            <span>+</span>
            <span className="font-medium">scroll</span>
            <span className="text-gray-400">para zoom</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
