import React, { useState } from 'react';
import { Chevron } from '../SVG/Icons';

interface ProductDetailAccordionItemProps {
  picto: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const ProductDetailAccordionItem = ({
  picto,
  title,
  children,
}: ProductDetailAccordionItemProps) => {
  // todo recupérer la marque du produit puis recupérer ses specs techinques
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="pb-6 not-first:border-t mt-4 text-primary border-b border-primary">
      <div
        className="flex items-center justify-between gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="">{picto}</div>
          <h2 className="font-bold">{title}</h2>
        </div>
        <div
          className={`h-2 w-2 flex items-center duration-300 ${isOpen ? 'rotate-90' : '-rotate-90'}`}
        >
          <Chevron />
        </div>
      </div>
      <div
        className={`px-4 ${isOpen ? 'max-h-[1000px] py-6 overflow-visible pointer-events-auto opacity-100 duration-300' : 'max-h-0 overflow-hidden pointer-events-none opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ProductDetailAccordionItem;
