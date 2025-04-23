import { Chevron } from '@/components/SVG/Icons';
import { BrandLink } from '@/types/Categories';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import Image from 'next/image';
import Link from 'next/link';

const BrandsList = ({ brands }: { brands?: BrandLink[] }) => {
  if (!brands || brands.length === 0) return null;
  return (
    <li key="brands" className="flex-1 min-w-0 max-w-[300px]">
      <div className="flex flex-col gap-2 font-bold text-primary">
        <div className="aspect-category-thumbnail bg-secondary-light rounded-lg flex justify-center items-center px-6 hover:bg-primary-light-alt duration-300">
          <Image
            src={PRODUCT_IMAGE_PLACEHOLDER}
            alt="Logo automatisme online"
            width={150}
            height={230}
            className="object-contain"
          />
        </div>
        {'Nos marques'}
      </div>

      <ul className="mt-2 grid grid-cols-2 gap-2">
        {brands.map((brand) => (
          <li key={brand.name}>
            <div className="flex items-center gap-2">
              <div className="text-secondary w-3 h-3 flex justify-center items-center rotate-180">
                <Chevron />
              </div>
              <Link
                href={`/marques/${brand.slug}`}
                className="block text-xs leading-general text-dark-grey hover:text-secondary duration-300"
              >
                {brand.name}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default BrandsList;
