import { ArrowBigUpDashIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ToTop = () => {
  //todo: afficher le composant uniquement quand on a scrollé
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <a
      href="#to-top"
      title="To top"
      aria-label="To top"
      className={`fixed text-primary w-10 h-10 z-20 bottom-4 rounded-md right-4 border border-solid border-primary flex items-center justify-center hover:bg-primary hover:text-white transistion duration-300 ${
        show ? 'opacity-100 hover:opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <ArrowBigUpDashIcon />
    </a>
  );
};

export default ToTop;
