import { CardProductProps } from '@/types/blocTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Heart } from '../SVG/Icons';

const Cardproduct = ({ product }: { product: CardProductProps }) => {
  return (
    <Link
      href={`/nos-produits/${product.slug}`}
      className="block h-full shadow-card px-3 py-5 rounded-[7px] md:rounded-lg duration-300 overflow-hidden bg-white group hover hover:shadow-cardhover"
    >
      <div className="relative min-h-[239px]">
        <div className="absolute inset-0 w-full flex items-center justify-center">
          <Image
            src={
              product.featuredImage?.node?.sourceUrl ||
              '/images/logo-automatisme-online.png'
            }
            alt={product.name}
            width={248}
            height={257}
            className="block h-full object-contain"
          />
        </div>
        <div className="bg-white flex justify-between items-center relative">
          <span className="px-[6px] rounded-[2px] h-[15px] flex items-center justify-center bg-primary-light text-[0.5rem] font-bold">
            Choix AO
          </span>
          <span>
            <Heart />
          </span>
        </div>
      </div>
      <h3 className="mt-4 mb-1 font-bold text-[0.9375rem] md:text-base leading-general group-hover:text-secondary duration-300">
        {product.name}
      </h3>
      <p className="text-dark-grey uppercase text-[0.6875rem] mb-[10px]">
        {product.sku}
      </p>
      <p className="mb-[10px]">Widget Avis vérifiés</p>
      <div className="font-bold text-2xl leading-general pr-7 relative w-fit mb-1">
        <div className="absolute text-sm font-bold right-0 top-0">TTC</div>
        <span className="text-base leading-general pr-1">{product.price}</span>€
      </div>
      <small className="text-dark-grey line-through">
        {product.regularPrice}
      </small>
    </Link>
  );
};

export default Cardproduct;
