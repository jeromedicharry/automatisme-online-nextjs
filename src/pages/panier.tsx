// Components
import Layout from '@/components/Layout/Layout.component';
import CartContents from '@/components/Cart/CartContents.component';

// Types
import type { NextPage } from 'next';

const Panier: NextPage = () => (
  <Layout title="Panier">
    <CartContents />
  </Layout>
);

export default Panier;
