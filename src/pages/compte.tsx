// Components
import Layout from '@/components/Layout/Layout';

// Types
import type { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
// import Modal from '@/components/Modals/Modal';
// import useAuth from '@/hooks/useAuth';
// import LogInForm from '@/components/Auth/LoginForm';
// import SignUpForm from '@/components/Auth/SignUpForm';
// import SendPasswordResetEmailForm from '@/components/Auth/SendPasswordResetEmailForm';
import Container from '@/components/container';
import {
  Heart,
  HouseSvg,
  InfoSvg,
  OrderSvg,
  ProCustomerSvg,
  UserSvg,
} from '@/components/SVG/Icons';
import TabLink, { TabType } from '@/components/Account/TabLink';
import Orders from '@/components/Account/orders';
import Favorites from '@/components/Account/Favorites';
import Profile from '@/components/Account/profile';
import Help from '@/components/Account/Help';
import LogOut from '@/components/Auth/Logout';
import Addresses from '@/components/Account/addresses';
import AuthModal from '@/components/Auth/AuthModal';
import useAuthModal from '@/hooks/useAuthModal';
import { isProRole } from '@/utils/functions/functions';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import Pro from '@/components/Account/pro';
import { ThemeSettingsProps } from '@/types/CptTypes';

const Compte = ({
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
}: {
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
}) => {
  const {
    isModalOpen,
    formStatus,
    setFormStatus,
    openModal,
    closeModal,
    loading,
    user,
  } = useAuthModal();

  const isPro = isProRole(user?.roles?.nodes);

  const [mobileNavClosed, setMobileNavClosed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('orders');

  // Ouvrir automatiquement la modale si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && (!user || !user?.id)) {
      openModal('login');
    }
  }, [loading, user, openModal]);

  if (loading) return <div>Loading...</div>;

  const navigation: {
    linkName: string;
    PageName: string;
    id: TabType;
    picto: JSX.Element;
  }[] = [
    {
      linkName: 'Mes commandes',
      PageName: 'Commandes',
      id: 'orders',
      picto: <OrderSvg />,
    },
    {
      linkName: 'Mes favoris',
      PageName: 'Favoris',
      id: 'favorites',
      picto: <Heart />,
    },
    {
      linkName: 'Gérer mes adresses',
      PageName: 'Adresses',
      id: 'addresses',
      picto: <HouseSvg />,
    },
    {
      linkName: 'Mon profil',
      PageName: 'Informations personnelles',
      id: 'profile',
      picto: <UserSvg />,
    },
    {
      linkName: "Besoin d'aide ?",
      PageName: "Besoin d'aide ?",
      id: 'help',
      picto: <InfoSvg />,
    },
    {
      linkName: isPro ? 'Mon compte pro' : 'Passer en compte pro',
      PageName: isPro ? 'Mon compte pro' : 'Passer en compte pro',
      id: 'pro',
      picto: <ProCustomerSvg />,
    },
  ];

  return (
    <Layout
      meta={{ title: 'Mon compte' }}
      title="Mon compte"
      uri="/compte"
      isBg
      excludeSeo
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      totalProducts={totalProducts}
    >
      <div>
        <Container>
          <div className="md:hidden">
            {mobileNavClosed ? null : (
              <h1 className="font-bold text-2xl leading-general mb-4">
                Mon compte
              </h1>
            )}
          </div>
          <div className="flex gap-10 items-start mb-10 md:mb-16">
            <aside
              className={`max-md:w-full md:mt-10 pb-3 pt-5 md:px-6 md:shadow-card rounded-lg md:bg-white sticky top-20 ${mobileNavClosed ? 'max-md:hidden' : ''}`}
            >
              <nav>
                <ul className="flex flex-col gap-3 align-start xxl:w-[325px]">
                  {navigation.map((item) => (
                    <TabLink
                      key={item.id}
                      id={item.id}
                      linkName={item.linkName}
                      picto={item.picto}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      setMobileNavClosed={setMobileNavClosed}
                    />
                  ))}
                  <li className="min-w-[230px]">
                    <LogOut />
                  </li>
                </ul>
              </nav>
            </aside>
            <section
              className={`w-full ${mobileNavClosed ? '' : 'max-md:hidden'}`}
            >
              {activeTab === 'orders' && (
                <Orders setMobileNavClosed={setMobileNavClosed} />
              )}
              {activeTab === 'favorites' && (
                <Favorites setMobileNavClosed={setMobileNavClosed} />
              )}
              {activeTab === 'addresses' && (
                <Addresses setMobileNavClosed={setMobileNavClosed} />
              )}
              {activeTab === 'profile' && (
                <Profile setMobileNavClosed={setMobileNavClosed} />
              )}
              {activeTab === 'help' && (
                <Help
                  setMobileNavClosed={setMobileNavClosed}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'pro' && (
                <Pro setMobileNavClosed={setMobileNavClosed} />
              )}
            </section>
          </div>
        </Container>
        <AuthModal
          isOpen={isModalOpen}
          onClose={closeModal}
          formStatus={formStatus}
          setFormStatus={setFormStatus}
          isNotClosable={true}
        />
      </div>
    </Layout>
  );
};

export default Compte;

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();

  return {
    props: {
      ...commonData,
    },
    revalidate: 36000,
  };
};
