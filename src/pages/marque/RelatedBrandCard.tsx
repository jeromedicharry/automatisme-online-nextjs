import { BrandCardProps } from '@/components/Brand/BrandCard';
import { Wifi } from 'lucide-react';
import React from 'react';

const RelatedBrandCard = ({
  brand,
  index,
}: {
  brand: BrandCardProps;
  index: number;
}) => {
  const wifiPosition = {
    bottomLeft: 'bottom-[-5px] left-[-5px] rotate-90',
    bottomRight: 'bottom-[-5px] right-[-5px]',
    topLeft: 'top-[-5px] left-[-5px] rotate-180',
    topRight: 'top-[-5px] right-[-5px] rotate-[-90deg]',
  };
  const getPositionClass = (index: number) => {
    if (index % 4 === 0) return wifiPosition.bottomLeft;
    if (index % 4 === 1) return wifiPosition.bottomRight;
    if (index % 4 === 2) return wifiPosition.topLeft;
    return wifiPosition.topRight;
  };
  const imageUrl = brand.thumbnailUrl || '';
  return (
    <div className="flex flex-col items-center justify-center shadow-card rounded-2xl relative p-4">
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={brand.name}
            className="w-full h-32 object-contain"
          />
          <div className="absolute bottom-2 right-4 text-sm text-gray-600 font-medium">
            {brand.name}
          </div>
        </>
      ) : (
        <div className="h-32 flex items-center justify-center">
          <span className="text-center font-bold">{brand.name}</span>
        </div>
      )}
      <div className={`absolute max-w-[105px] ${getPositionClass(index)}`}>
        <Wifi variant={'bleu2'} />
      </div>
    </div>
  );
};

export default RelatedBrandCard;
