// Components
import Layout from '@/components/Layout/Layout';
import CheckoutForm from '@/components/Checkout/CheckoutForm';

// Types
import type { NextPage } from 'next';

const Caisse: NextPage = () => (
  <Layout meta={{}} title="Caisse">
    <CheckoutForm />
  </Layout>
);

export default Caisse;
