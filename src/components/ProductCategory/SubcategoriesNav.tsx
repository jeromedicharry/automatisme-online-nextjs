import Link from 'next/link';
import { CategoryLinkProps } from '@/types/Categories'; // Assurez-vous d'avoir ce type défini

const SubcategoriesNav = ({
  subCategories,
}: {
  subCategories: CategoryLinkProps[] | undefined;
}) => {
  if (!subCategories || subCategories.length === 0) {
    return null;
  }

  return (
    <nav>
      <ul className="flex justify-start items-start mb-6 md:mb-4 gap-2 overflow-x-auto scrollbar-custom pb-4">
        {subCategories.map((child) => (
          <li key={child?.uri}>
            <Link
              href={`${child?.uri}`}
              className="bg-white py-2 px-4 rounded-[4px] text-xs leading-general whitespace-nowrap text-dark-grey duration-300 hover:bg-primary hover:text-white"
            >
              {child?.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubcategoriesNav;
