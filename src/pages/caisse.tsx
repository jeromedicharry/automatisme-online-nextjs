// Components
import Layout from '@/components/Layout/Layout';
// import CheckoutForm from '@/components/Checkout/CheckoutForm';

// Types
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modals/Modal';
import useAuth from '@/hooks/useAuth';
import LogInForm from '@/components/Auth/LoginForm';
import SignUpForm from '@/components/Auth/SignUpForm';
import SendPasswordResetEmailForm from '@/components/Auth/SendPasswordResetEmailForm';

type FormStatusProps = 'login' | 'register' | 'reset';

const Caisse: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [formStatus, setFormStatus] = useState<FormStatusProps>('login');

  const { loggedIn, loading, user } = useAuth();
  useEffect(() => {
    if (loggedIn) {
      setIsModalOpen(false);
    }
  }, [loggedIn]);

  if (loading) return <div>Loading...</div>;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout meta={null} title="Caisse" uri="/checkout">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-general text-center text-balance">
          Page de caisse
        </h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isNotClosable
          size="small"
        >
          {formStatus === 'register' ? (
            <SignUpForm
              setFormStatus={setFormStatus}
              handleCloseModal={handleCloseModal}
            />
          ) : formStatus === 'login' ? (
            <LogInForm
              setFormStatus={setFormStatus}
              handleCloseModal={handleCloseModal}
            />
          ) : formStatus === 'reset' ? (
            <SendPasswordResetEmailForm />
          ) : (
            <>TOTO</>
          )}
        </Modal>
      </div>
      {/* <CheckoutForm /> */}
    </Layout>
  );
};

export default Caisse;
