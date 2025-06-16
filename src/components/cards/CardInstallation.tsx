import { installationData } from '@/stores/IntermediateCartContext';
import Image from 'next/image';
import { Wifi } from '../SVG/Icons';
import Cta from '../atoms/Cta';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';

const CardInstallation = ({
  installation,
}: {
  installation: installationData;
}) => {
  return (
    <div className="bg-secondary-light rounded-2xl overflow-hidden flex flex-col justify-between">
      <div className="w-full flex items-center justify-between overflow-hidden">
        <Image
          src={
            installation?.image?.node?.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER
          }
          alt={installation?.title}
          width={300}
          height={250}
          className="block h-full w-full object-cover"
        />
      </div>
      <div className="relative pt-[32px] pb-[25px] sm:pb-[55px] px-4 overflow-hidden">
        <div
          className={`absolute max-w-[70px] sm:max-w-[90px] bottom-[-5px] left-[-5px] rotate-90`}
        >
          <Wifi variant={'orange'} />
        </div>

        <h3
          className="text-xl font-medium leading-general faq-title relative text-primary"
          dangerouslySetInnerHTML={{ __html: installation?.title }}
        />
        {installation?.ctaLabel && installation?.ctaSlug && (
          <div className="w-fit">
            <Cta
              label={installation.ctaLabel}
              slug={installation.ctaSlug}
              size="default"
              variant="primaryHollow"
              additionalClass="relative mt-8 mb-9"
            >
              {installation.ctaLabel}
            </Cta>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardInstallation;
