import Link from 'next/link';
import React from 'react';
import { Chevron } from '../SVG/Icons';

interface HelpCardProps {
  title: string;
  text: string;
  picto: React.ReactNode;
  slug?: string;
  switchTab?: () => void;
}

const HelpCard = ({ title, text, picto, slug, switchTab }: HelpCardProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (switchTab) {
      e.preventDefault(); // Empêche la navigation si on veut juste changer d’onglet
      switchTab();
    }
  };

  return (
    <Link
      href={slug || '#'}
      title={title}
      className="shadow-card p-6 rounded-[7px] bg-white duration-300 hover:shadow-cardhover"
      onClick={handleClick}
    >
      <h2 className="font-medium text-xl leading-general flex items-center gap-3 mb-[10px]">
        <div className="text-secondary">{picto}</div>
        {title}
      </h2>
      <p className="flex justify-between items-center gap-4">
        {text}
        <div className="text-secondary w-4 h-4 flex items-center rotate-180">
          <Chevron />
        </div>
      </p>
    </Link>
  );
};

export default HelpCard;
