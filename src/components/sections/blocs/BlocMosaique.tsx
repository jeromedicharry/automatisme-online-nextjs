import Image from 'next/image';

import Container from '@/components/container';
import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import { BlocMosaiqueProps } from '@/types/blocTypes';

const BlocMosaique = ({ bloc }: { bloc: BlocMosaiqueProps }) => {
  if (!bloc || !bloc.mosaique) return null;
  console.log('bloc', bloc);
  return (
    <Container>
      <section className="mb-12 md:mb-16 max-md:max-w-md mx-auto">
        <BlocIntroSmall title={bloc.title} />
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-3 md:grid-rows-2 gap-4 md:align-stretch">
          <figure className="relative rounded-2xl overflow-hidden">
            <Image
              src={bloc.mosaique[0]?.image?.node?.sourceUrl || ''}
              width={780}
              height={480}
              alt={bloc.mosaique[0]?.title}
              className="h-full w-full object-cover"
            />
            <caption className="absolute p-4 left-0 bottom-0 right-0 text-white text-left">
              {bloc?.mosaique[0]?.title}
            </caption>
          </figure>
          <figure className="relative rounded-2xl overflow-hidden md:col-start-1 md:row-start-2">
            <Image
              src={bloc.mosaique[1]?.image?.node?.sourceUrl}
              width={780}
              height={480}
              alt={bloc.mosaique[1]?.title}
              className="h-full w-full object-cover"
            />
            <caption className="absolute p-4 left-0 bottom-0 right-0 text-white text-left">
              {bloc?.mosaique[1]?.title}
            </caption>
          </figure>
          <figure className="relative rounded-2xl overflow-hidden md:row-span-2 mdcol-start-2 md:row-start-1">
            <Image
              src={bloc.mosaique[2]?.image?.node?.sourceUrl}
              width={780}
              height={480}
              alt={bloc.mosaique[2]?.title}
              className="h-full w-full object-cover"
            />
            <caption className="absolute p-4 left-0 bottom-0 right-0 text-white text-left">
              {bloc?.mosaique[2]?.title}
            </caption>
          </figure>
        </div>
      </section>
    </Container>
  );
};

export default BlocMosaique;
