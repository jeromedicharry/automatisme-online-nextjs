import React from 'react';
import Cta from './atoms/Cta';
import { LargeCartSvg } from './SVG/Icons';

interface EmptyElementProps {
  picto?: React.ReactNode;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaSlug?: string;
  ctaType?: 'primary' | 'secondary';
}

const EmptyElement = ({
  picto,
  title,
  subtitle,
  ctaLabel,
  ctaSlug,
  ctaType,
}: EmptyElementProps) => {
  return (
    <section className="py-8 px-4 lg:py-[38px] bg-white flex flex-col shadow-card text-center rounded-lg w-full">
      <div className="flex justify-center large-svg">
        {picto || <LargeCartSvg />}
      </div>

      <h2 className="mt-2 text-2xl font-bold">{title}</h2>
      <div className="text-sm mt-2 mb-6 md:mb-4 text-balance">{subtitle}</div>
      {ctaLabel && ctaSlug && (
        <Cta
          label={ctaLabel}
          slug={ctaSlug}
          size="default"
          variant={ctaType}
          isFull={false}
        >
          {ctaLabel}
        </Cta>
      )}
    </section>
  );
};

export default EmptyElement;
