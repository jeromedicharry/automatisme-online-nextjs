// Components
import Layout from '@/components/Layout/Layout';

// Types
import type { NextPage } from 'next';
import { useState } from 'react';
// import Modal from '@/components/Modals/Modal';
// import useAuth from '@/hooks/useAuth';
// import LogInForm from '@/components/Auth/LoginForm';
// import SignUpForm from '@/components/Auth/SignUpForm';
// import SendPasswordResetEmailForm from '@/components/Auth/SendPasswordResetEmailForm';
import Container from '@/components/container';
import {
  Chevron,
  Heart,
  HouseSvg,
  InfoSvg,
  LogoutSvg,
  OrderSvg,
  ProCustomerSvg,
  UserSvg,
} from '@/components/SVG/Icons';
import TabLink, { TabType } from '@/components/Account/TabLink';
import Orders from '@/components/Account/Orders';
import Favorites from '@/components/Account/Favorites';
import Addresses from '@/components/Account/addresses';
import Profile from '@/components/Account/Profile';
import Help from '@/components/Account/Help';

// type FormStatusProps = 'login' | 'register' | 'reset';

const Compte: NextPage = () => {
  const [mobileNavClosed, setMobileNavClosed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  // const [isModalOpen, setIsModalOpen] = useState(true);

  // const [formStatus, setFormStatus] = useState<FormStatusProps>('login');

  // const { loggedIn, loading, user } = useAuth();
  // useEffect(() => {
  //   if (loggedIn) {
  //     setIsModalOpen(false);
  //   }
  // }, [loggedIn]);

  // if (loading) return <div>Loading...</div>;

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

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
      linkName: 'Passer en compte pro',
      PageName: 'Passer en compte pro',
      id: 'pro',
      picto: <ProCustomerSvg />,
    },
  ];

  const handleLogout = () => {
    console.log('lgout');
  };

  return (
    <Layout
      meta={{ title: 'Caisse' }}
      title="Caisse"
      uri="/checkout"
      isBg
      excludeSeo
    >
      <div>
        <Container>
          <div className="flex gap-10">
            <aside
              className={`max-md:mx-auto max-md:mb-10 md:mt-10 pb-3 pt-5 px-6 w-fit shadow-card rounded-lg bg-white sticky top-20 ${mobileNavClosed ? 'max-md:hidden' : ''}`}
            >
              <nav>
                <ul className="flex flex-col gap-3">
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
                    <button
                      onClick={() => {
                        handleLogout();
                      }}
                      className={`w-full gap-3 font-bold flex items-center duration-300 justify-between`}
                    >
                      <div className="flex gap-[10px] items-center">
                        <LogoutSvg /> Déconnexion
                      </div>
                      <div className="rotate-180">
                        <Chevron />
                      </div>
                    </button>
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
              {activeTab === 'pro' && <div>Passer en compte pro</div>}
            </section>
          </div>
        </Container>
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}

        {/* <Modal
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
        </Modal> */}
      </div>
    </Layout>
  );
};

export default Compte;
