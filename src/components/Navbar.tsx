import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Share2, X, Instagram } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMobile } from '@/hooks/useMobile';
import logo from '@/assets/img/cuchaforas_logo_rojo.svg';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'El Proyecto', href: '/proyecto' },
  { name: 'Las Artesanas', href: '/artesanas' },
  { name: 'Proceso', href: '/proceso' },
  { name: 'Quiénes Somos', href: '/equipo' },
  { name: 'Contacto', href: '/contacto' },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [socialOpen, setSocialOpen] = useState<boolean>(false);
  const location = useLocation();
  const isMobile = useMobile(426);
  const textVariants = {
    initial: {
      opacity: 0,
      x: 20,
    },
    hover: {
      opacity: 1,
      x: 0,
      color: '#c4c4c4',
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  } as const;

  const containerLinksVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Tiempo entre cada link
        delayChildren: 0.8, // Espera a que el panel lateral termine de entrar
      },
    },
  } as const;

  const itemLinkVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring', // Cambiamos a resorte
        stiffness: 200, // Rigidez: cuánto "tira" el resorte
        damping: 7, // Amortiguación: cuánto tarda en detenerse (menos es más rebote)
        mass: 0.8, // Masa: lo hace sentir más ligero o pesado
      },
    },
  } as const;

  const iconVariants = {
    initial: {
      color: '#FFFFFF',
    },
    hover: {
      color: '#c4c4c4', // Color más claro en hover
      transition: { duration: 0.2 },
    },
  } as const;

  const menuRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // Usamos el hook pasando la ref y la acción
  useClickOutside(menuRef, () => setMenuOpen(false));
  useClickOutside(socialRef, () => setSocialOpen(false));

  return (
    <div className="min-w-screen h-20 flex justify-end z-50 p-5">
      <div
        className={`fixed flex flex-col items-end gap-6 z-[60] ${isMobile ? 'top-5 right-5' : 'top-11 right-11'}`}
      >
        {/* Botón de Menú */}
        <motion.button
          className={`flex items-center ${menuOpen || socialOpen ? 'hidden' : 'block'}`}
          initial="initial"
          whileHover="hover"
          onClick={() => {
            setMenuOpen(true);
          }}
        >
          <motion.span
            variants={textVariants}
            className="text-white pr-2 pointer-events-none absolute right-8 whitespace-nowrap"
          >
            Menú
          </motion.span>
          <motion.div variants={iconVariants}>
            <Menu size={30} />
          </motion.div>
        </motion.button>

        {/* Botón de Compartir */}
        <motion.button
          className={`flex items-center ${menuOpen || socialOpen ? 'hidden' : 'block'}`}
          initial="initial"
          whileHover="hover"
          onClick={() => {
            setSocialOpen(true);
          }}
        >
          <motion.span
            variants={textVariants}
            className="text-white pr-2 pointer-events-none absolute right-8 whitespace-nowrap"
          >
            Compartir
          </motion.span>
          <motion.div variants={iconVariants}>
            <Share2 size={30} />
          </motion.div>
        </motion.button>
      </div>

      {/* Menu Desplegable */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ right: -500 }}
            animate={{ right: 0 }}
            exit={{ right: -500 }}
            transition={{
              duration: 0.6,
            }}
            className={`fixed min-h-screen z-[60] top-0 right-0 w-96 ${isMobile ? 'bg-black' : 'bg-black/50'} shadow-2xl overflow-hidden`}
          >
            <div className=" relative w-full mb-5">
              <button className="absolute top-4  right-4">
                <X
                  size={32}
                  className=" text-white hover:text-brand-mustard transition-colors duration-300"
                  onClick={() => setMenuOpen(false)}
                />
              </button>
            </div>

            <motion.div
              className="flex justify-center p-6"
              initial={{ y: -200 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.9,
                ease: 'easeOut',
              }}
            >
              <img
                src={logo}
                alt="Logo Cucháforas"
                className="w-20 h-20 rounded-full"
              />
            </motion.div>

            <motion.div
              className="px-4 py-4 space-y-1"
              variants={containerLinksVariants}
              initial="hidden"
              animate="visible"
            >
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div key={item.name} variants={itemLinkVariants}>
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex gap-5 items-center justify-end px-4 py-3 text-base font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white hover:bg-white/10 hover:text-white/70'
                      }`}
                    >
                      {item.name}

                      <div className="bg-brand-purple-dark w-3 h-3 rounded-full"></div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Desplegable RR.SS */}

      <AnimatePresence>
        {socialOpen && (
          <motion.div
            ref={socialRef}
            initial={{ right: -500 }}
            animate={{ right: 0 }}
            exit={{ right: -500 }}
            transition={{
              duration: 0.6,
            }}
            className={`fixed min-h-screen z-[60] top-0 right-0 w-28 ${isMobile ? 'bg-black' : 'bg-black/50'} shadow-2xl overflow-hidden`}
          >
            <motion.div
              className="flex flex-col items-center gap-4 px-4 py-4 space-y-1 mt-10"
              variants={containerLinksVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemLinkVariants}>
                <Link
                  to="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand-mustard transition-colors duration-300"
                >
                  <svg
                    viewBox="0 0 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 fill-current"
                  >
                    <g id="Blogger">
                      <path d="M15.52,34A9.42,9.42,0,0,1,6.1,24.58V15.29A9.29,9.29,0,0,1,15.38,6h4.93c4.16,0,8.23,3.61,8.23,7v1.45a2.34,2.34,0,0,0,2.34,2.34h1.46a1.56,1.56,0,0,1,1.56,1.56v6.5A9.11,9.11,0,0,1,24.79,34ZM21.9,15.07h0a1.75,1.75,0,0,0-1.75-1.75H14.88a1.75,1.75,0,0,0-1.76,1.75h0a1.76,1.76,0,0,0,1.76,1.76h5.27A1.75,1.75,0,0,0,21.9,15.07ZM27,25h0a1.75,1.75,0,0,0-1.76-1.75H14.88A1.75,1.75,0,0,0,13.12,25h0a1.76,1.76,0,0,0,1.76,1.76H25.22A1.76,1.76,0,0,0,27,25Z" />
                    </g>
                  </svg>
                </Link>
              </motion.div>

              <motion.div variants={itemLinkVariants}>
                <Link
                  to="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram
                    size={32}
                    className="text-white hover:text-brand-mustard transition-colors duration-300"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
