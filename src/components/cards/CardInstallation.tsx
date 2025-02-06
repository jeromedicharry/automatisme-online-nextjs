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
    <div className="bg-secondary-light rounded-2xl overflow-hidden h-full flex flex-col justify-between">
      <div className="h-[250px] w-full flex items-center justify-between overflow-hidden">
        <Image
          src={
            installation?.image?.node?.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER
          }
          alt={installation?.title}
          width={300}
          height={250}
          className="block h-full object-cover"
        />
      </div>
      <div className="relative pt-[61px] pb-[55px] px-4 overflow-hidden">
        <div
          className={`absolute max-w-[105px] bottom-[-5px] left-[-5px] rotate-90`}
        >
          <Wifi variant={'orange'} />
        </div>

        <h3
          className="text-xl font-medium leading-general faq-title relative text-primary"
          dangerouslySetInnerHTML={{ __html: installation?.title }}
        />
        {installation?.ctaLabel && installation?.ctaSlug && (
          <Cta
            label={installation.ctaLabel}
            slug={installation.ctaSlug}
            size="default"
            variant="primaryHollow"
            additionalClass="relative mt-4 mb-20"
          >
            {installation.ctaLabel}
          </Cta>
        )}
      </div>
    </div>
  );
};

export default CardInstallation;
