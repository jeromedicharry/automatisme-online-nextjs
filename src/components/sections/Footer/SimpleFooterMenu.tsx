import Link from 'next/link';
import React from 'react';

export interface SimpleFooterMenuProps {
  submenu: {
    label: string;
  };

  menuItems: {
    nodes: {
      label: string;
      uri: string;
    }[];
  };
}

const SimpleFooterMenu = ({ menu }: { menu?: SimpleFooterMenuProps }) => {
  return (
    <nav className="text-white">
      <p className="text-base leading-general font-bold max-sm:text-center mb-6">
        {menu?.submenu?.label}
      </p>
      <ul className="flex flex-wrap justify-center sm:flex-col gap-4">
        {menu?.menuItems?.nodes.map((item, key) => (
          <div key={key} className="w-fit flex gap-4 items-center">
            {key > 0 && <span className="sm:hidden">•</span>}
            <li key={key} className="flex">
              <Link
                href={item?.uri || '/'}
                className="font-normal md:text-xs leading-general hover:text-secondary duration-300"
              >
                {item?.label}
              </Link>
            </li>
          </div>
        ))}
      </ul>
    </nav>
  );
};

export default SimpleFooterMenu;
