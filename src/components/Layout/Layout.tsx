// Imports
import { ReactNode, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';

// Components
import Meta, { IMeta } from './Meta';
import Header from '../sections/Header/Header';
import Footer from '@/components/sections/Footer/Footer';
import CartModal from '../Modals/CartModal';

// State
import { CartContext } from '@/stores/CartProvider';

// Utils
import { getFormattedCart } from '@/utils/functions/functions';

// GraphQL
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';

// Types
import { SimpleFooterMenuProps } from '../sections/Footer/SimpleFooterMenu';
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
  const { setCart } = useContext(CartContext);

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // Update cart in the localStorage.
      const updatedCart = getFormattedCart(data);

      if (!updatedCart && !data?.cart?.contents?.nodes.length) {
        // Should we clear the localStorage if we have no remote cart?
        return;
      }

      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));

      // Update cart data in React Context.
      setCart(updatedCart);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Meta meta={meta} uri={uri} excludeSeo={excludeSeo} />
      <div id="to-top"></div>

      <Header categoriesMenu={categoriesMenu} />
      <div
        className={`min-h-screen flex flex-col font-primary ${isHome ? 'pt-[128px] md:pt-[200px]' : 'pt-[140px] md:pt-[187px]'} ${isBg ? 'bg-primary-light' : ''}`}
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
