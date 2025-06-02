import { BrandLink, CategoryMenuProps } from '@/types/Categories';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import Image from 'next/image';
import Link from 'next/link';
import BrandsList from './BrandsList';
import AccordionSubcategory from './AccordionSubcategory';

const DefaultCategoryMenu = ({
  subcategories,
  brands,
}: {
  subcategories: CategoryMenuProps[];
  brands?: BrandLink[];
}) => {

  return (
    <ul className="flex gap-6 w-full items-stretch">
      {subcategories.map((subItem) => (
        <li key={subItem.name} className="flex-1 min-w-0 max-w-[300px]">
          <Link
            href={subItem.uri}
            className="flex flex-col gap-2 font-bold text-primary hover:text-secondary"
          >
            <div className="aspect-category-thumbnail bg-primary-light-alt rounded-lg flex justify-center items-center px-6 hover:bg-secondary-light duration-300">
              <Image
                src={subItem.image?.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER}
                alt={subItem.name}
                width={150}
                height={230}
                className="object-contain"
              />
            </div>
            {subItem.name}
          </Link>
          {subItem.children?.nodes?.length > 0 && (
            <ul className="mt-2 space-y-2">
              {subItem.children.nodes.map((subSubItem) => (
                <AccordionSubcategory
                  key={subSubItem.name}
                  subSubItem={subSubItem}
                />
              ))}
            </ul>
          )}
        </li>
      ))}
      <BrandsList brands={brands} />
    </ul>
  );
};

export default DefaultCategoryMenu;
