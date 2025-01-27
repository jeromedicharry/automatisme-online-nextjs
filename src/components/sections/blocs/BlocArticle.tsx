import Container from '@/components/container';
import { Wifi } from '@/components/SVG/Icons';
import { BlocArticleProps } from '@/types/blocTypes';
import { slugify } from '@/utils/functions/functions';
import Image from 'next/image';

const BlocArticle = ({ bloc }: { bloc: BlocArticleProps }) => {
  // todo manage mobile
  return (
    <Container>
      <article
        id={bloc.anchorId || slugify(bloc.title)}
        className={`scroll-m-6 max-md:max-w-md mx-auto mb-12 md:mb-16 rounded-2xl gap-5 overflow-hidden relative flex flex-col md:items-stretch lg:min-h-[500px] ${bloc.isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} ${bloc.bgColor === 'Orange clair' ? 'bg-secondary-light' : 'bg-primary-light-alt'}`}
      >
        {bloc?.image?.node?.sourceUrl && (
          <div className="w-full md:w-[340px]">
            <Image
              src={bloc?.image?.node?.sourceUrl}
              alt={bloc?.title}
              width={510}
              height={750}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="w-full md:w-[calc(100%-340px)] flex flex-col justify-center px-16 py-8 gap-4">
          <div
            className={`max-w-[180px] absolute bottom-[-8px] ${bloc.isImageLeft ? 'right-[-8px]' : 'left-[-8px] rotate-90'}`}
          >
            <Wifi
              variant={bloc.bgColor === 'Orange clair' ? 'orange' : 'bleu'}
            />
          </div>
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
        </div>
      </article>
    </Container>
  );
};

export default BlocArticle;
