// Imports
import { ReactNode } from 'react';

// Components
import Meta from './Meta';
import type { IMeta } from './Meta';
import Header from '@/components/sections/Header/Header';
import Footer from '@/components/sections/Footer/Footer';
import CartModal from '@/components/Modals/CartModal';

// Types
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import ToTop from '../atoms/ToTop';

export interface DoubleLevelFooterMenuProps {
  menuItems: {
    nodes: {
      label: string;
      uri: string | null;
      childItems?: {
        nodes: {
          label: string;
          uri: string;
        }[];
      };
    }[];
  };
}

interface LayoutProps {
  children?: ReactNode;
  meta: IMeta;
  uri?: string;
  title?: string;
  footerMenu1?: SimpleFooterMenuProps | undefined;
  footerMenu2?: SimpleFooterMenuProps | undefined;
  footerMenu3?: DoubleLevelFooterMenuProps | undefined;
  themeSettings?: any;
  isHome?: boolean;
  isBrand?: boolean;
  categoriesMenu?: CategoryMenuProps[];
  isBg?: boolean;
  excludeSeo?: boolean;
  totalProducts?: number;
}

/**
 * Renders layout for each page. Also passes along the title to the Header component.
 * @function Layout
 * @param {ReactNode} children - Children to be rendered by Layout component
 * @param {TTitle} title - Title for the page. Is set in <title>{title}</title>
 * @returns {JSX.Element} - Rendered component
 */
const Layout = ({
  children,
  meta,
  uri,
  footerMenu1,
  footerMenu2,
  footerMenu3,
  themeSettings,
  isHome = false,
  isBrand = false,
  categoriesMenu,
  isBg = false,
  excludeSeo = false,
  totalProducts,
}: LayoutProps) => {
  return (
    <>
      <Meta meta={meta} uri={uri} excludeSeo={excludeSeo} />
      <div id="to-top"></div>

      <Header
        categoriesMenu={categoriesMenu}
        qtyInstallers={themeSettings?.quantityInstallers}
        totalProducts={totalProducts}
      />
      <div
        className={`min-h-screen flex flex-col font-primary ${
          isHome
            ? 'pt-[128px] md:pt-[200px]'
            : isBrand
              ? 'pt-[112px] md:pt-[116px] lg:pt-[152px]'
              : 'pt-[140px] md:pt-[187px]'
        } ${isBg ? 'bg-primary-light' : ''}`}
      >
        <main className="grow shrink-0 text-primary font-primary">
          {children}
        </main>
        <Footer
          menu1={footerMenu1}
          menu2={footerMenu2}
          menu3={footerMenu3}
          themeSettings={themeSettings}
        />
        <CartModal />
        <ToTop />
      </div>
    </>
  );
};

export default Layout;
