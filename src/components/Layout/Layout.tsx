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

interface LayoutProps {
  children?: ReactNode;
  meta: IMeta;
  uri?: string;
  title?: string;
  footerMenu1?: SimpleFooterMenuProps | undefined;
  footerMenu2?: SimpleFooterMenuProps | undefined;
  themeSettings?: any;
  isHome?: boolean;
  categoriesMenu?: CategoryMenuProps[];
  isBg?: boolean;
  excludeSeo?: boolean;
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
  themeSettings,
  isHome = false,
  categoriesMenu,
  isBg = false,
  excludeSeo = false,
}: LayoutProps) => {
  return (
    <>
      <Meta meta={meta} uri={uri} excludeSeo={excludeSeo} />
      <div id="to-top"></div>

      <Header categoriesMenu={categoriesMenu} />
      <div
        className={`min-h-screen flex flex-col font-primary ${
          isHome ? 'pt-[128px] md:pt-[200px]' : 'pt-[140px] md:pt-[187px]'
        } ${isBg ? 'bg-primary-light' : ''}`}
      >
        <main className="grow shrink-0 text-primary font-primary">
          {children}
        </main>
        <Footer
          menu1={footerMenu1}
          menu2={footerMenu2}
          themeSettings={themeSettings}
        />
        <CartModal />
      </div>
    </>
  );
};

export default Layout;
