import { CardConseilProps } from '@/types/blocTypes';
import Image from 'next/image';
import React from 'react';
import { Wifi } from '../SVG/Icons';
import Cta from '../atoms/Cta';

const CardAdvice = ({ item }: { item: CardConseilProps }) => {
  return (
    <article
      className={`h-full relative overflow-hidden pt-6 pb-20 px-6 md:pb-12 md:rounded-[13px] w-full md:gap-10 md:mx-auto md:px-10 lg:px-[110px] xl:max-w-[1108px] flex flex-col gap-4 items-center justify-center md:justify-between md:items-stretch ${item.bgColor === 'Orange clair' ? 'bg-secondary-light' : 'bg-primary-light'} ${item.isImageLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      <div
        className={`absolute bottom-[-20px] right-[-20px] lg:top-10 ${item.isImageLeft ? 'md:left-[-20px] md:right-auto md:rotate-90' : ''}`}
      >
        <Wifi variant={item.bgColor === 'Orange clair' ? 'orange' : 'bleu'} />
      </div>
      <div className="w-full md:w-fit flex flex-col justify-center items-center md:items-start ">
        {item.title && (
          <h3
            dangerouslySetInnerHTML={{
              __html: item.title,
            }}
            className="font-bold max-md:text-center text-4xl  md:text-5xl leading-general"
          />
        )}
        {item.subtitle && (
          <em className="text-secondary font-medium italic md:text-xl leading-general">
            {item.subtitle}
          </em>
        )}
        {item?.cta && (
          <Cta
            label={item.cta.label}
            slug={item.cta.slug}
            size="default"
            variant="primary"
            additionalClass="mt-2"
          >
            {item.cta.label}
          </Cta>
        )}
      </div>
      <div className="w-full max-md:max-w-md max-md:mx-auto md:w-1/2 relative">
        {item.image?.node?.sourceUrl && (
          <Image
            src={item.image.node.sourceUrl}
            alt={item.title}
            width={500}
            height={500}
            className="w-full h-full object-contain rounded-[17px]"
          />
        )}
      </div>
    </article>
  );
};

export default CardAdvice;
