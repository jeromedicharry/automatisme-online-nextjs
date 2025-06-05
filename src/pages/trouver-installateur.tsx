import Layout from '@/components/Layout/Layout';
import type { GetStaticProps } from 'next';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import Container from '@/components/container';
import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import dynamic from 'next/dynamic';
import { Installer, useInstallerSearch } from '@/hooks/useInstallerSearch';
import InstallerSearch from '@/components/Installer/InstallerSearch';
import InstallerCard from '@/components/Installer/InstallerCard';
import { GET_INSTALLERS } from '@/utils/gql/WEBSITE_QUERIES';
import EmptyElement from '@/components/EmptyElement';
import { OrderSvg } from '@/components/SVG/Icons';
import client from '@/utils/apollo/ApolloClient';
import { ThemeSettingsProps } from '@/types/CptTypes';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

// Import dynamique de la carte pour éviter les erreurs SSR
const InstallerMap = dynamic(
  () => import('@/components/Installer/InstallerMap'),
  { ssr: false },
);

const InstallerPage = ({
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
  installateurs, // On passe la liste complète des installateurs
}: {
  themeSettings: ThemeSettingsProps;
  totalProducts: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
  installateurs: (Installer & { distance?: number })[];
}) => {
  const {
    filteredInstallers,
    searchCenter,
    isLoading,
    error,
    searchInstallers,
    activeInstallerIndex,
    setActiveInstallerIndex,
  } = useInstallerSearch(installateurs);

  return (
    <Layout
      meta={{
        title: 'Trouver un installateur Automatisme Online',
        metaDesc:
          'Trouver un installateur Automatisme Online de confiance dans votre ville ou votre région',
      }}
      title="Trouver un installateur Automatisme Online"
      uri="/trouver-installateur"
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      totalProducts={totalProducts}
    >
      <Container>
        <BlocIntroLarge
          title="Faites installer votre kit de motorisation"
          subtitle="Entrez votre ville, trouvez les installateurs à moins de 50km chez vous. Nous vous mettrons en relation."
        />

        <div className="flex flex-col-reverse md:grid md:grid-cols-2 md:gap-8 mb-16">
          <div className="md:sticky md:top-10 lg:top-16 xxl:top-28 md:h-[calc(100vh-7rem)]">
            <InstallerMap
              installers={filteredInstallers}
              activeCardIndex={activeInstallerIndex}
              setActiveCardIndex={setActiveInstallerIndex}
              center={searchCenter || undefined}
            />
          </div>

          <div className="">
            <h2 className="text-sm sm:text-xl font-bold leading-general text-center mb-3 md:mb-6">
              {'Trouver votre installateur près de chez vous'}
            </h2>
            <InstallerSearch onSearch={searchInstallers} />

            {filteredInstallers.length === 0 && searchCenter && (
              <p className="md:hidden text-center mb-8 p-4 border border-primary text-balance">
                {"Nous n'avons pas trouvé d'installateur dans votre ville."}
              </p>
            )}

            {isLoading && (
              <div>
                <p className="text-center mb-8">
                  {"Recherche d'installateurs en cours..."}
                </p>
                <div className="mb-6 md:mb-10">
                  <LoadingSpinner />
                </div>
              </div>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="max-md:hidden">
              {!searchCenter && (
                <EmptyElement
                  picto={<OrderSvg />}
                  title="Lancer une recherche"
                  subtitle="Entrez votre ville ou votre code postal, nous rechercherons un installateur à moins de 50km de votre ville"
                />
              )}
              {filteredInstallers.length === 0 && searchCenter && (
                <EmptyElement
                  picto={<OrderSvg />}
                  title="Aucun installateur trouvé"
                  subtitle="Nous n'avons pas trouvé d'installateur dans votre ville."
                />
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredInstallers.map((installer, index) => (
                  <InstallerCard
                    key={index}
                    title={installer.title}
                    address={installer.acfContent.address}
                    distance={installer.distance}
                    phone={installer.acfContent.phone}
                    email={installer.acfContent.email}
                    installerId={installer.databaseId}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default InstallerPage;

// Fonction pour récupérer tous les installateurs avec pagination
const fetchAllInstallers = async () => {
  let allInstallers: any[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const { data }: any = await client.query({
      query: GET_INSTALLERS,
      variables: { cursor },
    });

    allInstallers = [...allInstallers, ...data.installateurs.nodes];
    hasNextPage = data.installateurs.pageInfo.hasNextPage;
    cursor = data.installateurs.pageInfo.endCursor;
  }

  return allInstallers;
};

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();
  const installateurs = await fetchAllInstallers();

  return {
    props: {
      ...commonData,
      installateurs, // On passe la liste complète en props
    },
    revalidate: 36000,
  };
};
