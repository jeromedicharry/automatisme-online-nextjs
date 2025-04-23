import { CategoryMenuProps } from '@/types/Categories';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import Image from 'next/image';
import Link from 'next/link';

const TelecommandesCategoryMenu = ({
  subcategories,
  image,
}: {
  subcategories: CategoryMenuProps[];
  image?: string;
}) => {
  return (
    <div className="flex gap-6">
      <div className="aspect-square bg-primary-light-alt rounded-lg flex justify-center items-center px-6 w-1/4">
        <Image
          src={image || PRODUCT_IMAGE_PLACEHOLDER}
          alt="Catégorie de produit Automatisme Online"
          width={250}
          height={250}
          className="object-contain"
        />
      </div>

      {/* Sous-catégories en 4 colonnes, même hauteur que l'image */}
      <ul className="w-3/4 grid grid-cols-4 gap-4 lg:gap-5 xl:gap-6 items-start h-fit">
        {subcategories.map((subItem) => (
          <li key={subItem.name}>
            <Link
              href={subItem.uri}
              className="text-xs leading-general font-bold text-primary hover:text-secondary h-full duration-200"
            >
              {subItem.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TelecommandesCategoryMenu;
