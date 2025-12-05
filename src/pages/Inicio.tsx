import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ChevronDown, Sparkles, Star, HandHeart } from 'lucide-react';
import artesana1 from '@/assets/img/artesana1.jpg';
import artesana2 from '@/assets/img/artesana2.jpg';
import artesana3 from '@/assets/img/artesana3.jpg';
import cuchafora from '@/assets/img/cuchaforas_logo_negro - copia.png';

// Imágenes del carrusel
const heroSlides = [
  {
    id: 1,
    image: artesana1,
    title: 'Manos que tallan',
    subtitle: 'historias en madera',
    alt: 'Artesana tallando madera',
  },
  {
    id: 2,
    image: artesana2,
    title: 'Hilos que tejen',
    subtitle: 'memoria y resistencia',
    alt: 'Telar artesanal',
  },
  {
    id: 3,
    image: artesana3,
    title: 'Barro que moldea',
    subtitle: 'futuros posibles',
    alt: 'Cerámica en proceso',
  },
];

const Inicio = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Carrusel */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Slides Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{
              duration: 0.8,
              // ease: [0.43, 0.13, 0.23, 0.96],
              ease: 'easeInOut',
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroSlides[currentSlide].image})`,
              }}
            >
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-dark/30 via-transparent to-brand-red/20" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-8"
          >
            <img
              src={cuchafora}
              alt="cuchaforas logo"
              className="md:w-1/3 mx-auto mb-5 mt-[-30px] "
            />
            <p
              className="text-xl sm:text-2xl lg:text-3xl text-white font-medium"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
            >
              Objetos poéticos de artesanía
            </p>
          </motion.div>

          {/* Animated Subtitle from Carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 max-w-2xl"
            >
              <p
                className="text-3xl sm:text-4xl lg:text-5xl font-display text-brand-mustard font-bold mb-2"
                style={{ textShadow: '0 2px 15px rgba(0,0,0,0.9)' }}
              >
                {heroSlides[currentSlide].title}
              </p>
              <p
                className="text-xl sm:text-2xl text-white/90 italic"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
              >
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/artesanas')}
            className="relative group"
          >
            {/* Button */}
            <div className="relative flex items-center gap-3 px-8 py-4 mt-[-20px] bg-brand-mustard text-background rounded-full font-display font-bold text-lg shadow-2xl border-2 border-brand-mustard-light hover:bg-brand-mustard-light transition-colors">
              <Sparkles className="w-5 h-5" />
              <span>Explorar la Constelación</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.button>

          {/* Progress Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute bottom-24 left-6 sm:left-8 lg:left-12"
          >
            |
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <p className="text-sm text-white font-semibold drop-shadow-lg">
              Descubre más
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-6 h-10 rounded-full border-2 border-white/80 flex items-start justify-center pt-2 backdrop-blur-sm bg-black/20 group-hover:bg-black/30 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </motion.div>
          </motion.button>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative bg-gradient-to-b from-[#656293] to-[#9695c3] py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-8">
              Resistencias que brillan en las grietas
            </h2>
            <p className="text-lg sm:text-xl text-white leading-relaxed">
              Este proyecto emerge como un homenaje a las mujeres artesanas
              chilenas que crean en medio de la crianza, transformando lo
              cotidiano en arte, la fatiga en belleza, y la soledad en
              comunidad.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {[
              {
                title: 'Historias Talladas',
                description:
                  'Cada cuchara es una metáfora, un símbolo de resistencia creativa en medio de lo cotidiano.',
                icon: <Sparkles className="w-8 h-8 text-white" />,
              },
              {
                title: 'Red de Mujeres',
                description:
                  'Una constelación que conecta artesanas de todo Chile, visibilizando su trabajo y resiliencia.',
                icon: <Star className="w-8 h-8 text-white" />,
              },
              {
                title: 'Arte y Crianza',
                description:
                  'Explorando cómo compatibilizar el estado creativo con el estado de criar y cuidar.',
                icon: <HandHeart className="w-8 h-8 text-white" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-20"
            onClick={() => navigate('/proyecto')}
          >
            <a className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-purple-dark rounded-full font-display font-bold text-lg hover:bg-brand-mustard hover:text-background transition-colors shadow-xl">
              Conoce el Proyecto Completo
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
