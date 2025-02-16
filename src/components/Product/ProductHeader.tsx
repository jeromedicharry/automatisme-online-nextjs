import Image from 'next/image';
import React from 'react';
import { BrandStickerProps } from './ProductContent';

const ProductHeader = ({
  title,
  brand,
}: {
  title: string;
  brand: BrandStickerProps;
}) => {
  return (
    <header>
      <div className="flex text-xl leading-general text-primary justify-between lg:items-end gap-5">
        <h1>{title}</h1>

        <div className="h-fit">
          {brand?.thumbnail?.sourceUrl ? (
            <Image
              src={brand?.thumbnail.sourceUrl}
              width={80}
              height={80}
              alt={brand?.name}
              className="max-w-[60px]"
            />
          ) : (
            <span className="bg-secondary text-white text-sm leading-general px-2 py-1 rounded-md font-bold">
              {brand?.name}
            </span>
          )}
        </div>
      </div>
      <div>Avis vérifiés</div>
    </header>
  );
};

export default ProductHeader;
