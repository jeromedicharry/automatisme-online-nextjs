import Cta from '@/components/atoms/Cta';
import Container from '@/components/container';
import { Wifi } from '@/components/SVG/Icons';
import { BlocAnchorsPictosProps } from '@/types/blocTypes';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import Image from 'next/image';
import Link from 'next/link';

const BlocAnchorsPicto = ({ bloc }: { bloc: BlocAnchorsPictosProps }) => {
  if (!bloc || !bloc.items || bloc.items.length === 0) return null;
  const { items, cta, infoBloc, infoText } = bloc;
  return (
    <Container>
      <section className="bg-primary-light-alt px-2 pt-9 pb-4 relative rounded-2xl overflow-hidden mb-12 md:mb-16">
        <div className="absolute left-[-20px] bottom-[-20px] w-40 rotate-90">
          <Wifi variant="bleu2" />
        </div>
        <div className="grid xs:grid-cols-2 items-center lg:flex justify-center gap-y-12 gap-x-5 md:items-stretch mb-12 relative w-fit mx-auto">
          {items.map((item, index) => (
            <div
              className="flex flex-col items-center justify-center gap-6 md:w-[250px] mx-auto"
              key={index}
            >
              <div className="bg-white rounded-[3px] w-[72px] h-[72px] flex items-center justify-center relative">
                <Image
                  src={item.picto?.node?.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER}
                  alt={item.text}
                  width={72}
                  height={72}
                  className="max-w-[56px] object-cover"
                />
                <span className="absolute -bottom-2 -left-2 w-5 h-5 text-sm leading-none rounded-full bg-secondary text-white flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div
                className="text-center text-sm md:text-base leading-general"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
              <div className="mt-auto flex justify-center">
                <Link
                  title={'En savoir plus'}
                  href={`#anchor-${index + 1}`}
                  className="mt-6 duration-300 hover:text-secondary font-bold underline"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          ))}
        </div>
        {infoBloc?.text && (
          <div className="bg-white px-4 md:px-8 py-4 rounded-lg font-bold relative text-center">
            <div className="flex justify-center items-center gap-[10px] w-fit mx-auto">
              {infoBloc?.picto && (
                <Image
                  src={infoBloc?.picto?.node?.sourceUrl}
                  alt={infoBloc?.text}
                  width={48}
                  height={48}
                  className="max-w-[24px] shrink-0"
                />
              )}
              <span className="inline-block max-w-fit text-[15px] md:text-base leading-general">
                {infoBloc.text}
              </span>
            </div>
          </div>
        )}

        {cta?.label && cta?.slug && (
          <Cta
            label={cta.label}
            slug={cta.slug}
            additionalClass="w-full md:w-fit mx-auto mt-12 relative"
            isFull
          >
            {cta.label}
          </Cta>
        )}

        {infoText && (
          <div
            className="w-fit ml-auto mr-8 text-sm text-black mt-4 relative"
            dangerouslySetInnerHTML={{ __html: infoText }}
          />
        )}
      </section>
      {items.map((item, index) => (
        <section
          className="mb-12 md:mb-16 flex gap-6 md:gap-16 max-md:flex-col items-center max-lg:items-stretch scroll-m-6"
          id={`anchor-${index + 1}`}
          key={index}
        >
          <div className="md:shrink-1 lg:max-w-[420px] xxl:max-w-[555px] xxl:shrink-0 max-md:w-fit max-md:mx-auto relative">
            <Image
              src={
                item.targetSection?.image?.node?.sourceUrl ||
                PRODUCT_IMAGE_PLACEHOLDER
              }
              alt={item.targetSection?.title}
              width={550}
              height={550}
              className="md:shrink-1 lg:min-h-[420px] xxl:min-h-[555px] h-full object-cover rounded-2xl"
            />
            <span className="absolute left-0 top-[-6px] md:top-[-24px] md:left-[-24px] text-xl font-bold w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center">
              {index + 1}
            </span>
          </div>
          <div className="max-w-[420px] md:max-w-[60%] md:shrink-0 mx-auto">
            <h2 className="text-xl text-black font-medium leading-general mb-2">
              {item.targetSection?.title}
            </h2>
            {item.targetSection?.subTitle && (
              <div
                dangerouslySetInnerHTML={{
                  __html: item.targetSection.subTitle,
                }}
                className="font-bold text-sm text-black"
              />
            )}

            {item.targetSection?.advantages?.length > 0 && (
              <div className="mt-12 flex flex-col gap-4">
                {item.targetSection?.advantages?.map((advantage, index) => (
                  <div key={index}>
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-secondary">
                        <BulletSvg />
                      </div>
                      <span className="font-bold text-black">
                        {advantage.title}
                      </span>
                    </div>
                    <div
                      className="text-black wysiwyg"
                      dangerouslySetInnerHTML={{
                        __html: advantage.text,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {cta?.label && cta?.slug && (
        <Cta
          label={cta.label}
          slug={cta.slug}
          additionalClass="w-full md:w-fit mx-auto mb-12 md:mb-16"
        >
          {cta.label}
        </Cta>
      )}
    </Container>
  );
};

export default BlocAnchorsPicto;

export const BulletSvg = () => {
  return (
    <svg
      width="7"
      height="9"
      viewBox="0 0 7 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.8752 0.41996L6.50237 3.48583C7.16588 4.04666 7.16588 4.94399 6.50237 5.50482L2.8752 8.58004C1.81359 9.47737 -6.91689e-09 8.84176 -6.24835e-08 7.57055L-3.30919e-07 1.42945C-3.86486e-07 0.158239 1.81359 -0.477368 2.8752 0.41996Z"
        fill="currentColor"
      />
    </svg>
  );
};
