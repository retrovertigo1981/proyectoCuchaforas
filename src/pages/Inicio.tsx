import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { Volume2, VolumeX } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useMobile } from '@/hooks/useMobile';
import artesana1 from '@/assets/img/artesana1.jpg';
import cuchafora from '@/assets/img/cuchaforas_logo_negro - copia.png';

const AUDIO_SRC = '/sonidos/Voz_cuchaforas.mp3';

// Función para precargar el audio en caché del navegador
const preloadAudioToCache = async (src: string) => {
  try {
    const response = await fetch(src, { mode: 'no-cors' });
    if (response.ok) {
      console.log('Audio pre-cargado en caché');
    }
  } catch (error) {
    console.log('Precarga en caché no disponible:', error);
  }
};

const Inicio = () => {
  const navigate = useNavigate();
  const isMobile = useMobile(426);
  const welcomeSoundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Usar sessionStorage para persistir solo durante la sesión del navegador
  const hasInteractedRef = useRef(
    typeof window !== 'undefined' &&
      sessionStorage.getItem('audio_interacted') === 'true'
  );

  // Variantes de animación para iconos (mismo estilo que Navbar)
  const iconTextVariants = {
    initial: {
      opacity: 0,
      x: 20,
    },
    hover: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  } as const;

  const iconVariants = {
    initial: {
      color: '#FFFFFF',
    },
    hover: {
      color: '#c4c4c4',
      transition: { duration: 0.2 },
    },
  } as const;

  // Función para alternar audio
  const toggleAudio = useCallback(() => {
    if (!welcomeSoundRef.current) return;

    // Marcar que el usuario ha interactuado con el audio y persistir en sessionStorage
    hasInteractedRef.current = true;
    sessionStorage.setItem('audio_interacted', 'true');

    if (welcomeSoundRef.current.playing()) {
      welcomeSoundRef.current.pause();
      setIsPlaying(false);
    } else {
      welcomeSoundRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    console.log('🎵 [Inicio] useEffect ejecutado - componente montado');

    // Precargar en caché inmediatamente
    preloadAudioToCache(AUDIO_SRC);

    // Configuración con streaming (html5: true) para reproducción inmediata
    welcomeSoundRef.current = new Howl({
      src: [AUDIO_SRC],
      volume: 0.5,
      preload: true,
      html5: true, // ← Habilita streaming - reproduce mientras descarga
      autoplay: false, // ← Cambiado a false, controlamos manualmente
      loop: true,
      onload: () => {
        console.log('Audio cargado completamente');
      },
      onloaderror: (error) => {
        console.error('Error cargando audio:', error);
      },
      onplay: () => {
        console.log('Reproducción iniciada');
        setIsPlaying(true);
      },
      onpause: () => {
        console.log('Reproducción pausada');
        setIsPlaying(false);
      },
      onend: () => {
        console.log('Reproducción finalizada');
        setIsPlaying(false);
      },
    });

    // Verificar estado REAL del audio al montar
    const checkActualState = () => {
      if (welcomeSoundRef.current) {
        const actuallyPlaying = welcomeSoundRef.current.playing();
        console.log(
          '🎵 [Inicio] Estado real del audio al montar:',
          actuallyPlaying
        );
        // Solo actualizamos isPlaying si NO ha interactuado, para no sobrescribir su elección
        if (!hasInteractedRef.current) {
          setIsPlaying(actuallyPlaying);
        }
      }
    };

    // Solo intentar reproducir en la PRIMERA VISITA (si no ha interactuado)
    const tryPlay = () => {
      if (
        welcomeSoundRef.current &&
        !welcomeSoundRef.current.playing() &&
        !hasInteractedRef.current
      ) {
        console.log(
          '🎵 [Inicio] Primera visita - intentando reproducir audio...'
        );
        welcomeSoundRef.current.play();
      } else if (hasInteractedRef.current) {
        console.log('🎵 [Inicio] Usuario ya interactuó - NO auto-reproducir');
      }
    };

    // PRIMERA CARGA: Intentar reproducir inmediatamente
    tryPlay();

    // Retry con delay por si el primer intento falla por autoplay policy
    const timeoutId = setTimeout(() => {
      console.log('🎵 [Inicio] Retry de reproducción...');
      tryPlay();
    }, 100);

    // Escuchar cuando el audio esté listo para reproducir
    welcomeSoundRef.current.once('load', () => {
      console.log('🎵 [Inicio] Audio listo, verificando estado...');
      checkActualState();
      tryPlay();
    });

    return () => {
      console.log('🎵 [Inicio] Cleanup - desmontando componente');
      clearTimeout(timeoutId);
      welcomeSoundRef.current?.unload();
    };
  }, []);

  return (
    <div className="h-screen bg-background overflow-hidden">
      <motion.img
        src={artesana1}
        alt="Artesana Background"
        initial={{ scale: 1 }}
        animate={{ scale: 1.5 }}
        transition={{
          duration: 40,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="h-full w-full object-cover brightness-[0.6]"
      />
      <Navbar />

      {/* Control de Volumen - Debajo de los iconos del Navbar */}
      <motion.button
        className={`absolute flex items-center ${isMobile ? 'top-36 right-8' : 'top-[150px] right-10'} z-40`}
        initial="initial"
        whileHover="hover"
        onClick={toggleAudio}
      >
        <motion.span
          variants={iconTextVariants}
          className="text-white pr-2 pointer-events-none absolute right-8 whitespace-nowrap"
        >
          {isPlaying ? 'Silenciar' : 'Activar Audio'}
        </motion.span>
        <motion.div variants={iconVariants}>
          {isPlaying ? <Volume2 size={30} /> : <VolumeX size={30} />}
        </motion.div>
      </motion.button>

      <div className="absolute inset-0 top-52 flex flex-col">
        <img
          src={cuchafora}
          alt="cuchaforas logo"
          className={`${isMobile ? 'w-80' : 'w-1/3'}  mx-auto mb-14 mt-[-10px]`}
        />

        {/* md:w-1/3 */}

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/creadoras')}
          className="relative group mx-auto"
        >
          {/* Button */}
          <div className="relative flex items-center gap-3 px-8 py-4 w-44 h-44 text-background rounded-full font-display font-bold text-lg shadow-2xl border-2 border-brand-mustard-light hover:bg-brand-mustard-light transition-colors">
            {/* <Sparkles className="w-5 h-5" /> */}
            <span>Explorar la Cartografía</span>
            {/* <Sparkles className="w-5 h-5" /> */}
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default Inicio;
