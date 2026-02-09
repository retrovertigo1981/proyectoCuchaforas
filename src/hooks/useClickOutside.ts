import { useEffect } from 'react';
import type {RefObject} from 'react'

// Usamos un tipo genérico <T> para que sirva para cualquier elemento (div, nav, ul, etc.)
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
): void => {
  useEffect(() => {
    // El evento es de tipo MouseEvent o TouchEvent (para móviles)
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Comprobamos que el clic sea fuera del elemento referenciado
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // Soporte para móviles

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback]);
};


