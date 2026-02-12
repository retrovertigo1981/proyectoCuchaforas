import { Link } from 'react-router';
import { Navbar } from '@/components/Navbar';
import artesanas from '@/assets/img/artesana1.jpg';
import logoNegro from '@/assets/img/cuchaforas_logo_negro.svg';

export const Banner = () => {
  return (
    <>
      <Navbar />
      <Link to="/">
        <img
          src={logoNegro}
          alt="Logo Cucháforas"
          className="fixed top-11 ml-4 w-20 h-20 rounded-full sm:ml-10 z-50"
        />
      </Link>
      <div
        className="absolute flex items-center top-0 right-0 w-full h-40 z-40 bg-cover bg-center bg-no-repeat brightness-50"
        style={{ backgroundImage: `url(${artesanas})` }}
      ></div>
    </>
  );
};
