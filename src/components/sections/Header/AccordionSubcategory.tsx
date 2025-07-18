import { useState } from 'react';
import { Chevron } from '@/components/SVG/Icons';
import Link from 'next/link';
import { CategoryMenuProps } from '@/types/Categories';

// Composant pour les sous-catégories avec accordéon
const AccordionSubcategory = ({
  subSubItem,
}: {
  subSubItem: CategoryMenuProps;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = subSubItem.children?.nodes?.length > 0;

  const toggleAccordion = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li>
      <div className="flex items-center gap-2">
        {hasChildren ? (
          <div
            className={`text-secondary w-2 h-2 shrink-0 flex justify-center items-center cursor-pointer transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-180'}`}
            onClick={toggleAccordion}
          >
            <Chevron />
          </div>
        ) : (
          <div className="text-secondary w-2 shrink-0 h-2 flex justify-center items-center rotate-180">
            <Chevron />
          </div>
        )}

        <Link
          href={subSubItem.uri}
          className="block text-sm leading-general text-dark-grey hover:text-secondary duration-300"
        >
          {subSubItem.name}
        </Link>
      </div>

      {hasChildren && (
        <ul
          className={`ml-6 overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {subSubItem.children.nodes.map((subSubSubItem) => (
            <li key={subSubSubItem.name} className="list-disc text-dark-grey">
              <Link
                href={subSubSubItem.uri}
                className="block text-sm leading-general text-dark-grey hover:text-secondary duration-300"
              >
                {subSubSubItem.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default AccordionSubcategory;
