import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import Container from '@/components/container';
import {
  BrandLink,
  CategoryMenuProps,
  ParentCategoryDesktopMenuType,
} from '@/types/Categories';
import DefaultCategoryMenu from './DefaultCategoryMenu';
import TelecommandesCategoryMenu from './TelecommandesCategoryMenu';
import Cta from '@/components/atoms/Cta';
import AccessoiresCategoryMenu from './AccessoiresCategoryMenu';

const DesktopParentCategorySubMenu = ({
  subcategories,
  type,
  brands,
  image,
  parentCategoryName,
  parentCategorySlug,
}: {
  subcategories: CategoryMenuProps[] | undefined;
  type?: ParentCategoryDesktopMenuType;
  brands?: BrandLink[];
  image?: string;
  parentCategoryName: string;
  parentCategorySlug: string;
}) => {
  if (!subcategories || subcategories.length === 0) {
    return null;
  }
  return (
    <div className="absolute top-full left-[50%] -translate-x-[50%] pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:flex w-screen bg-white p-6 xl:py-8 shadow-card duration-300 overflow-hidden rounded-b-lg">
      <Container large>
        <div className="flex justify-between items-start">
          <BlocIntroSmall title={`${parentCategoryName}`} />
          <div className="w-fit">
            <Cta
              slug={`${parentCategorySlug}`}
              label="Voir les produits"
              variant="secondary"
              size="small"
            >
              {'Voir les produits'}
            </Cta>
          </div>
        </div>
        {type === 'default' && (
          <DefaultCategoryMenu subcategories={subcategories} brands={brands} />
        )}
        {type === 'telecommandes' && (
          <TelecommandesCategoryMenu
            subcategories={subcategories}
            image={image}
          />
        )}
        {type === 'accessoires' && (
          <AccessoiresCategoryMenu
            subcategories={subcategories}
            image={image}
            brands={brands}
          />
        )}
      </Container>
    </div>
  );
};

export default DesktopParentCategorySubMenu;
