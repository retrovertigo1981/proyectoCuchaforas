import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useEffect } from 'react';
import logoRojo from '@/assets/img/cuchaforas_logo_rojo.svg';

export const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const progress = useMotionValue(0);
  const displayProgress = useTransform(progress, (value) => `${Math.round(value)}%`);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      setIsVisible(true);
      sessionStorage.setItem('hasVisited', 'true');
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    const controls = animate(progress, 100, {
      duration: 3.5,
      delay: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    });

    return () => {
      clearTimeout(timer);
      controls.stop();
    };
  }, [progress]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 3.9 }}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="relative w-[150px] h-[150px] rounded-full overflow-hidden"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 3.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img
              src={logoRojo}
              alt="Cuchaforas"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        <motion.span className="text-sm font-mono text-[#f5f5f5]">
          {displayProgress}
        </motion.span>
      </div>
    </motion.div>
  );
};
