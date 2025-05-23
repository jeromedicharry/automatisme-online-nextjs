import React from 'react';
import Container from '../container';
import Image from 'next/image';
import BreadCrumbs from '../atoms/BreadCrumbs';
import { Star } from '../atoms/AvisVerifiesReassurance';
import RatingGauge from '../atoms/RatingGauge';

const Hero = ({
  title,
  logo,
  description,
  breadCrumbs,
  image,
  globalNote,
  notes,
}: {
  title: string;
  logo: string;
  description: string;
  breadCrumbs?: { text: string; url: string }[];
  image: string;
  globalNote: number;
  notes: { label: string; note: number }[];
}) => {
  return (
    <section className="bg-primary-light relative mb-10 md:mb-16">
      <Container>
        <div className="pt-4 pb-10 lg:py-10 xl:py-16 lg:min-h-[400px] xl:min-h-[480px] lg:w-3/5 xl:w-2/3 lg:pr-10">
          <BreadCrumbs breadCrumbs={breadCrumbs} />
          <div className="flex gap-6 flex-col lg:flex-row lg:gap-10 lg:items-center">
            <div>
              <h1 aria-label={title} className="mt-[60px] mb-[32px]">
                {logo ? (
                  <Image
                    src={logo}
                    width={200}
                    height={200}
                    alt={title}
                    className="max-h-[90px] max-w-[250px] object-cover"
                  />
                ) : (
                  <div className="font-bold text-xl md:text-3xl leading-general">
                    {title}
                  </div>
                )}
              </h1>
              <div
                className="wysiwyg"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            <div className="bg-white px-4 md:px-6 lg:px-10 py-6 shrink-0 shadow-md rounded-sm max-lg:max-w-[300px] mx-auto">
              <div className="text-center font-semibold text-sm leading-general">
                {'Indice de confiance'}
              </div>
              <p className="text-5xl font-bold text-center">{globalNote}</p>
              <div className="flex gap-1 w-fit mx-auto">
                <Star color="orange" />
                <Star color="orange" />
                <Star color="orange" />
                <Star color="orange" />
                <Star color="orange" />
              </div>
              <div className="text-center text-dark-grey text-xs leading-general mb-8">
                {'Notation par Automatisme Online'}
              </div>
              {notes?.length > 0 && (
                <div className="space-y-2">
                  {notes?.map((note) => (
                    <RatingGauge
                      key={note.label}
                      label={note.label}
                      rating={note.note}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {image ? (
        <Image
          src={image}
          width={1000}
          height={1000}
          alt={title}
          className="lg:absolute top-0 right-0 h-full object-cover lg:w-2/5 xl:w-1/3 xl:max-w-[576px]"
        />
      ) : (
        <div className="bg-secondary-light lg:absolute top-0 right-0 h-full object-cover lg:w-2/5 xl:w-1/3 xl:max-w-[576px]"></div>
      )}
    </section>
  );
};

export default Hero;
