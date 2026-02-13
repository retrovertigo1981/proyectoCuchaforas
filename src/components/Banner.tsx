import { Link } from 'react-router';
import { Navbar } from '@/components/Navbar';
import artesanas from '@/assets/img/artesana1.jpg';
import logoNegro from '@/assets/img/cuchaforas_logo_negro.svg';

export const Banner = () => {
  return (
    <div className="relative w-full h-40">
      {/* Contenedor con filtro de brillo (solo afecta a la imagen) */}
      <div
        className="absolute top-0 right-0 w-full h-full z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${artesanas})`,
          filter: 'brightness(0.7)',
        }}
      />

      {/* Navbar y Logo - POR ENCIMA del filtro */}
      <div className="relative z-50">
        <Navbar />
        <Link to="/">
          <img
            src={logoNegro}
            alt="Logo Cucháforas"
            className="absolute top-11 ml-4 w-20 h-20 rounded-full sm:ml-10"
          />
        </Link>
      </div>
    </div>
  );
};
