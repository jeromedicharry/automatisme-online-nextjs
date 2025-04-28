import { BrandLink, CategoryMenuProps } from '@/types/Categories';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import Image from 'next/image';
import Link from 'next/link';
import AccordionSubcategory from './AccordionSubcategory';

const AccessoiresCategoryMenu = ({
  subcategories,
  image,
  brands,
}: {
  subcategories: CategoryMenuProps[];
  image?: string;
  brands?: BrandLink[];
}) => {
  // Utilisation des marques passées en props si disponibles,
  // sinon utilisation des marques par défaut
  const brandsToShow = brands || [
    { name: 'Beninca', slug: 'beninca' },
    { name: 'BFT', slug: 'bft' },
    { name: 'Came', slug: 'came' },
    { name: 'Cardin', slug: 'cardin' },
    { name: 'Faac', slug: 'faac' },
    { name: 'Nice', slug: 'nice' },
    { name: 'Somfy', slug: 'somfy' },
    { name: 'V2', slug: 'v2' },
  ];

  // Calcul pour diviser les sous-catégories sur deux colonnes
  const midPoint = Math.ceil(subcategories.length / 2);
  const firstColumnSubcategories = subcategories.slice(0, midPoint);
  const secondColumnSubcategories = subcategories.slice(midPoint);

  return (
    <div className="flex gap-6">
      {/* Image à gauche qui déterminera la hauteur minimum */}
      <div className="aspect-square bg-primary-light-alt rounded-lg flex justify-center items-center px-6 w-1/4">
        <Image
          src={image || PRODUCT_IMAGE_PLACEHOLDER}
          alt="Catégorie de produit Automatisme Online"
          width={250}
          height={250}
          className="object-contain"
        />
      </div>

      {/* Container principal de droite - divisé en deux parties horizontales */}
      <div className="w-3/4 flex">
        {/* Première moitié: Catégories sur 2 colonnes */}
        <div className="w-1/2 pr-4">
          <div className="flex">
            {/* Première colonne de catégories */}
            <div className="w-1/2 pr-2">
              <ul className="grid grid-cols-1 gap-2">
                {firstColumnSubcategories.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.uri}
                      className="text-xs leading-general font-bold text-primary hover:text-secondary h-full duration-300"
                    >
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
              </ul>
            </div>

            {/* Deuxième colonne de catégories */}
            <div className="w-1/2 pl-2">
              <ul className="grid grid-cols-1 gap-2">
                {secondColumnSubcategories.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.uri}
                      className="text-xs leading-general font-bold text-primary hover:text-secondary h-full duration-300"
                    >
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
              </ul>
            </div>
          </div>
        </div>

        {/* Deuxième moitié: Section Brands sur 4 colonnes */}
        <div className="w-1/2">
          <h3 className="text-sm font-bold text-primary mb-4">Nos marques</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
            {brandsToShow.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={`/brand/${brand.slug}`}
                  className="block text-xs leading-general text-dark-grey hover:text-secondary duration-300"
                >
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccessoiresCategoryMenu;
