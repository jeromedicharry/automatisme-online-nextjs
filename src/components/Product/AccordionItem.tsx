import React, { useState } from 'react';
import { Chevron } from '../SVG/Icons';
import Image from 'next/image';

interface AccordionItemProps {
  picto?: React.ReactNode;
  pictoFromWP?: string;
  title: string;
  children: React.ReactNode;
  noBorderBottom?: boolean;
}

const AccordionItem = ({
  picto,
  pictoFromWP,
  title,
  children,
  noBorderBottom = false,
}: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`pb-6 not-first:border-t mt-4 text-primary ${noBorderBottom ? '' : 'border-b border-primary'}`}
    >
      <div
        className="flex items-center justify-between gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          {picto && <div className="">{picto}</div>}
          {pictoFromWP && (
            <Image src={pictoFromWP} alt={title} width={40} height={40} />
          )}
          <h2 className="font-bold">{title}</h2>
        </div>
        <div
          className={`h-2 w-2 flex items-center duration-300 ${isOpen ? 'rotate-90' : '-rotate-90'}`}
        >
          <Chevron />
        </div>
      </div>
      <div
        className={`${isOpen ? 'max-h-[1000px] pt-6 overflow-visible pointer-events-auto opacity-100 duration-300' : 'max-h-0 overflow-hidden pointer-events-none opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;
