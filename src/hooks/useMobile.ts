import {useEffect, useState} from 'react';


export const useMobile = (breakpoint: number = 768): boolean => {

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect( () => {

    const mediaQuery: MediaQueryList = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleResize = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches);
    }

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize)
    }
}, [breakpoint])

  return isMobile

}

