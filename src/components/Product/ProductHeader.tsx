import Image from 'next/image';
import React from 'react';
import { BrandStickerProps } from './ProductContent';

const ProductHeader = ({
  title,
  brand,
  productRef,
}: {
  title: string;
  brand?: BrandStickerProps;
  productRef?: string;
}) => {
  return (
    <header>
      <div className="flex text-xl leading-general text-primary justify-between lg:items-center gap-5">
        <div>
          <h1 className="text-2xl leading-general font-bold lg:max-w-[500px]">
            {title}
          </h1>
          <div className="">
            <div
              className="skeepers_product__stars"
              data-product-id={productRef}
            ></div>
          </div>
        </div>

        <div className="h-fit lg:self-end">
          {brand?.thumbnailUrl ? (
            <Image
              src={brand?.thumbnailUrl}
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
    </header>
  );
};

export default ProductHeader;
