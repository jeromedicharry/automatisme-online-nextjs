import Container from '@/components/container';

import Image from 'next/image';
import { Star } from '../atoms/AvisVerifiesReassurance';
import Cta from '../atoms/Cta';
import { formatDate } from '@/utils/functions/functions';

interface BlocSAVProps {
  image: {
    node: {
      sourceUrl: string;
    };
  };
  title: string;
  text: string;
  isImageLeft: boolean;
  savNote?: number;
  date?: string;
  brand?: string;
}

const BlocSAV = ({
  bloc,
  slug = '',
}: {
  bloc: BlocSAVProps;
  slug?: string;
}) => {
  return (
    <Container>
      <article
        className={`scroll-m-6 max-md:max-w-md mx-auto mb-12 md:mb-16 rounded-2xl gap-5 overflow-visible relative flex flex-col md:items-stretch lg:min-h-[500px] ${bloc.isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      >
        {bloc?.image?.node?.sourceUrl && (
          <div className="w-full md:w-[340px] xxl:w-[440px] shrink-0">
            <Image
              src={bloc?.image?.node?.sourceUrl}
              alt={bloc?.title}
              width={510}
              height={750}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="w-full flex flex-col justify-center md:px-6 md:py-6 lg:px-16 lg:py-8 gap-4">
          <div
            className={`max-w-[180px] absolute bottom-[-8px] ${bloc.isImageLeft ? 'right-[-8px]' : 'left-[-8px] rotate-90'}`}
          ></div>
          {bloc.title && (
            <h2
              dangerouslySetInnerHTML={{
                __html: bloc.title,
              }}
              className="font-bold text-4xl md:text-5xl leading-general text-balance"
            />
          )}

          {bloc.date && (
            <div className="text-sm text-dark-grey leading-general font-bold">
              Actualités {bloc.brand} - {formatDate(bloc.date)}
            </div>
          )}

          {bloc.text && (
            <div
              dangerouslySetInnerHTML={{
                __html: bloc.text,
              }}
              className="wysiwyg"
            />
          )}

          {bloc.savNote && (
            <div className="flex gap-4 md:gap-8 max-md:flex-col md:items-end">
              <div className="font-bold text-secondary">
                {'Indice de confiance Automatisme Online'}
              </div>

              <div>
                <p className="text-5xl font-bold text-center">
                  {' '}
                  {Number(bloc.savNote).toFixed(1)}
                </p>
                <div className="flex gap-1 w-fit mx-auto">
                  <Star color="orange" />
                  <Star color="orange" />
                  <Star color="orange" />
                  <Star color="orange" />
                  <Star color="orange" />
                </div>
              </div>
            </div>
          )}

          {slug && (
            <div className="w-fit mt-8 lg:mt-12">
              <Cta
                slug={`/blog/${slug}`}
                label="Lire cet article"
                variant="primaryHollow"
              >
                {"Lire l' article"}
              </Cta>
            </div>
          )}
        </div>
      </article>
    </Container>
  );
};

export default BlocSAV;
