import Container from '@/components/container';
import { Wifi } from '@/components/SVG/Icons';
import { BlocArticleProps } from '@/types/blocTypes';
import { slugify } from '@/utils/functions/functions';
import Image from 'next/image';

const BlocArticle = ({ bloc }: { bloc: BlocArticleProps }) => {
  return (
    <Container>
      <article
        id={bloc.anchorId || slugify(bloc.title)}
        className={`scroll-m-6 max-md:max-w-md mx-auto mb-12 md:mb-16 rounded-2xl gap-5 overflow-hidden relative flex flex-col md:items-stretch lg:min-h-[500px] ${bloc.isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} ${bloc.bgColor === 'Orange clair' ? 'bg-secondary-light' : 'bg-primary-light-alt'}`}
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

        <div className="w-full flex flex-col justify-center px-6 py-6 md:px-8 lg:px-16 md:py-8 gap-4">
          <div
            className={`max-w-[180px] absolute bottom-[-8px] ${bloc.isImageLeft ? 'right-[-8px]' : 'left-[-8px] rotate-90'}`}
          >
            <Wifi
              variant={bloc.bgColor === 'Orange clair' ? 'orange' : 'bleu2'}
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
