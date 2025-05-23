import Container from '@/components/container';

import Image from 'next/image';
import { Star } from '../atoms/AvisVerifiesReassurance';

interface BlocSAVProps {
  image: {
    node: {
      sourceUrl: string;
    };
  };
  title: string;
  text: string;
  isImageLeft: boolean;
  showNote: boolean;
}

const BlocSAV = ({ bloc, note }: { bloc: BlocSAVProps; note: number }) => {
  return (
    <Container>
      <article
        className={`scroll-m-6 max-md:max-w-md mx-auto mb-12 md:mb-16 rounded-2xl gap-5 overflow-hidden relative flex flex-col md:items-stretch lg:min-h-[500px] ${bloc.isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
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

          {bloc.text && (
            <div
              dangerouslySetInnerHTML={{
                __html: bloc.text,
              }}
              className="wysiwyg relative"
            />
          )}

          {note && (
            <div className="flex gap-4 md:gap-8 max-md:flex-col md:items-end">
              <div className="font-bold text-secondary">
                {'Indice de confiance Automatisme Online'}
              </div>

              <div>
                <p className="text-5xl font-bold text-center">{note}</p>
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
        </div>
      </article>
    </Container>
  );
};

export default BlocSAV;
