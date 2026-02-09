import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Navbar } from '@/components/Navbar';
import { useMobile } from '@/hooks/useMobile';
import artesana1 from '@/assets/img/artesana1.jpg';
import cuchafora from '@/assets/img/cuchaforas_logo_negro - copia.png';

const Inicio = () => {
  const navigate = useNavigate();
  const isMobile = useMobile(426);
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

      <div className="absolute inset-0 top-52 flex flex-col">
        <img
          src={cuchafora}
          alt="cuchaforas logo"
          className={`${isMobile ? 'w-80' : 'w-1/3'}  mx-auto mb-14 mt-[-50px]`}
        />

        {/* md:w-1/3 */}

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/artesanas')}
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
