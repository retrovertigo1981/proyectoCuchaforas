import { motion } from 'framer-motion';
import { Link } from 'react-router';
import logoCuchaforas from '@/assets/img/cuchaforas_logo_negro.svg';
import logoMCAP from '@/assets/img/23_MCAP_RGB-03.png';

const footerNavigation = [
  { name: 'Inicio', href: '/' },
  { name: 'El Proyecto', href: '/proyecto' },
  { name: 'Las Artesanas', href: '/artesanas' },
  { name: 'Proceso', href: '/proceso' },
  { name: 'Quiénes Somos', href: '/equipo' },
  { name: 'Contacto', href: '/contacto' },
];

export const Footer = () => {
  return (
    <footer className=" border-border texture-grain bg-[#9695c3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Grid principal: 3 columnas en desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12"
        >
          {/* Columna 1: Links de navegación (Izquierda) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:text-left md:self-start"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Explora</h3>
            <nav className="flex flex-col space-y-2">
              {footerNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-white hover:text-black transition-colors duration-200 inline-block w-fit"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Columna 2: Logo y misión (Centro) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:text-center md:self-start"
          >
            <Link to="/" className="inline-block mb-4 group">
              <img
                src={logoCuchaforas}
                alt="Logo Cuchaforas"
                className="h-40 w-auto rounded-full transition-transform duration-300 group-hover:scale-105 md:mx-auto"
              />
            </Link>
            <p className="text-sm text-white leading-relaxed max-w-xs mx-auto">
              Preservando la artesanía chilena a través de la innovación, el
              diseño contemporáneo y la tradición ancestral.
            </p>
          </motion.div>

          {/* Columna 3: Créditos Fondart (Derecha) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:text-right md:self-start"
          >
            <p className="text-sm text-white mb-3 font-medium">
              Proyecto financiado por
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="mb-4"
            >
              <img
                src={logoMCAP}
                alt="Ministerio de las Culturas, las Artes y el Patrimonio - Gobierno de Chile"
                className="h-32 w-auto transition-opacity duration-300 hover:opacity-80 md:ml-auto"
              />
            </motion.div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-white">
                Fondart 2025, Línea Artesanía
              </p>
              <p className="text-sm text-white">
                Ministerio de las Culturas, las Artes y el Patrimonio
              </p>
              <p className="text-sm text-white">Gobierno de Chile</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider animado */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-px bg-border mb-6 origin-left"
        />

        {/* Sección inferior */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm"
        >
          <p className="text-white">
            © {new Date().getFullYear()} Cuchaforas. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacidad"
              className="text-white hover:text-black transition-colors duration-200"
            >
              Privacidad
            </Link>
            <Link
              to="/terminos"
              className="text-white hover:text-black transition-colors duration-200"
            >
              Términos
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// import { motion } from 'framer-motion';
// import logoCuchaforas from '@/assets/img/cuchaforas_logo_negro.svg';
// import logoMCAP from '@/assets/img/23_MCAP_RGB-02.png';

// export const Footer = () => {
//     return (
//         <footer className="bg-card border-t border-border texture-grain">
//             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//                 {/* Logo */}
//                 <div className="flex justify-center mb-8">
//                     <img
//                         src={logoCuchaforas}
//                         alt="Logo Cuchaforas"
//                         className="h-24 w-auto rounded-full"
//                     />
//                 </div>

//                 {/* Fondart credit */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.6 }}
//                     className="text-center mb-8"
//                 >
//                     <p className="text-sm sm:text-base text-muted-foreground mb-2">
//                         Proyecto financiado por
//                     </p>
//                     <img src={logoMCAP} alt="Logo MCAP" className="h-40 w-auto mx-auto" />
//                     <p className="text-base sm:text-lg font-semibold text-foreground mb-1">
//                         Fondart 2025, Línea Artesanía
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                         Ministerio de las Culturas, las Artes y el Patrimonio
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                         Gobierno de Chile
//                     </p>
//                 </motion.div>

//                 {/* Divider */}
//                 <div className="h-px bg-border mb-6" />

//                 {/* Bottom info */}
//                 <div className="text-center">
//                     <p className="text-sm text-muted-foreground">
//                         © {new Date().getFullYear()} Cuchaforas. Todos los derechos reservados.
//                     </p>
//                 </div>
//             </div>
//         </footer>
//     );
// };
