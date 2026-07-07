import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { Volume2, VolumeX } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useMobile } from '@/hooks/useMobile';
import artesana1 from '@/assets/img/artesana1.jpg';
import cuchafora from '@/assets/img/cuchaforas_logo_negro - copia.png';

const AUDIO_SRC = '/sonidos/Voz_cuchaforas.mp3';

const Inicio = () => {
  const navigate = useNavigate();
  const isMobile = useMobile(431);
  const welcomeSoundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const hasInteractedRef = useRef(
    typeof window !== 'undefined' &&
      sessionStorage.getItem('audio_interacted') === 'true'
  );

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

  const initAudio = useCallback(() => {
    if (welcomeSoundRef.current) return;

    welcomeSoundRef.current = new Howl({
      src: [AUDIO_SRC],
      volume: 0.5,
      preload: true,
      html5: true,
      autoplay: false,
      loop: true,
      onload: () => {
        setAudioLoaded(true);
      },
      onloaderror: (_id, error) => {
        console.error('Error cargando audio:', error);
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
      },
    });
  }, []);

  const toggleAudio = useCallback(() => {
    initAudio();

    if (!welcomeSoundRef.current) return;

    hasInteractedRef.current = true;
    sessionStorage.setItem('audio_interacted', 'true');

    if (welcomeSoundRef.current.playing()) {
      welcomeSoundRef.current.pause();
      setIsPlaying(false);
    } else {
      welcomeSoundRef.current.play();
      setIsPlaying(true);
    }
  }, [initAudio]);

  return (
    <div id="main-content" className="h-screen bg-background overflow-hidden">
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
          {isPlaying ? 'Silenciar' : audioLoaded ? 'Activar Audio' : 'Cargar Audio'}
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

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/creadoras')}
          className="relative group mx-auto"
        >
          <div className="relative flex items-center gap-3 px-8 py-4 w-44 h-44 text-background rounded-full font-display font-bold text-lg shadow-2xl border-2 border-brand-mustard-light hover:bg-brand-mustard-light transition-colors">
            <span>Explorar la Cartografía</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default Inicio;
