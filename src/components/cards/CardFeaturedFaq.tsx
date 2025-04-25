import { CardFaqProps } from '@/types/blocTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Wifi } from '../SVG/Icons';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';

const CardFeaturedFaq = ({
  title,
  index,
  item,
}: {
  title: string;
  index: number;
  item: CardFaqProps;
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
  return (
    <Link
      href={`/questions-les-plus-frequentes/#${item?.faqItem?.nodes[0]?.databaseId}`}
      className="bg-secondary-light rounded-2xl overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="h-[163px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={
            item?.faqItem?.nodes[0]?.featuredImage?.node?.sourceUrl ||
            PRODUCT_IMAGE_PLACEHOLDER
          }
          alt={item?.title}
          width={325}
          height={163}
          className="h-[163px] w-full object-cover"
        />
      </div>
      <div className="relative pt-[61px] pb-[55px] px-2 overflow-hidden">
        <div className={`absolute max-w-[105px] ${getPositionClass(index)}`}>
          <Wifi variant={'orange'} />
        </div>
        {index === 0 ? (
          <h2 className="absolute text-xs text-dark-grey top-4 left-2">
            {title}
          </h2>
        ) : null}
        <h3
          className="text-xl font-medium leading-general faq-title relative"
          dangerouslySetInnerHTML={{ __html: item?.title }}
        />
      </div>
    </Link>
  );
};

export default CardFeaturedFaq;
