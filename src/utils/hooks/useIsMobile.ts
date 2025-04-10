import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', debounce(updateSize, 400));
    updateSize();

    return (): void => window.removeEventListener('resize', updateSize);
  }, []);
  console.log('toto', isMobile);

  return isMobile;
};

export default useIsMobile;
