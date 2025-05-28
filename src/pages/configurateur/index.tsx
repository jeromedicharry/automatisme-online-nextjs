import { useState } from 'react';
import ConfigurateurPortail from './ConfigurateurPortail';
import Layout from '@/components/Layout/Layout';
import Container from '@/components/container';
import { GetStaticProps } from 'next';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import {
  PortailSvg,
  PorteGarageSvg,
} from '@/components/SVG/ConfigurateurIcons';
import EmptyElement from '@/components/EmptyElement';
import { OrderSvg } from '@/components/SVG/Icons';
import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import { ThemeSettingsProps } from '@/types/CptTypes';
import ConfigurateurPorteGarage from './ConfigurateurPorteGarage';

type MainMotorisationType = 'portail' | 'porte-garage' | null;

const MotorisationForm = ({
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
  const [type, setType] = useState<MainMotorisationType>(null);
  const [message, setMessage] = useState<string>('');

  return (
    <Layout
      meta={{
        title: 'Configurateur de motorisation Automatisme Online',
        metaDesc:
          'Trouver le kit de motorisation le plus adapté à votre portail ou à votre porte de garage',
      }}
      title="Configurateur de motorisation Automatisme Online"
      uri="/configurateur"
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      excludeSeo
      totalProducts={totalProducts}
    >
      <Container>
        <BlocIntroLarge title="Comment choisir mon kit de motorisation ?" />
        <div className="flex flex-col md:flex-row gap-5 w-full bg-primary-light rounded-2xl p-6 md:p-8 my-10 md:my-16">
          <section className="shrink-0 flex-1">
            <form action="">
              <h2 className="font-medium text-xl leading-general mb-4">
                Je souhaite faire motoriser :
              </h2>
              <div className="flex items-center gap-4">
                <div className="configurator-radio">
                  <PortailSvg />
                  <label htmlFor="portail">Un portail</label>
                  <input
                    type="radio"
                    name="motorisation"
                    id="portail"
                    value="portail"
                    onChange={(e) =>
                      setType(e.target.value as MainMotorisationType)
                    }
                  />
                </div>
                <div className="configurator-radio">
                  <PorteGarageSvg />
                  <label htmlFor="porte-garage">Une porte de garage</label>
                  <input
                    type="radio"
                    name="motorisation"
                    id="porte-garage"
                    value="porte-garage"
                    onChange={(e) =>
                      setType(e.target.value as MainMotorisationType)
                    }
                  />{' '}
                </div>
              </div>
            </form>

            {type === 'portail' && (
              <ConfigurateurPortail setMessage={setMessage} />
            )}

            {type === 'porte-garage' && (
              <ConfigurateurPorteGarage setMessage={setMessage} />
            )}
          </section>
          <aside className="md:w-[300px] xl:w-[350px] xxl:w-[500px] md:sticky md:top-[140px] md:p-6 lg:p-8 h-fit">
            <h3 className="font-bold text-lg md:text-2xl leading-general pb-[1.25em] border-b border-primary mb-[1.25em]">
              Récapitulatif
            </h3>
            {message ? (
              <div className="message font-bold">{message}</div>
            ) : (
              <EmptyElement
                title="Complétez le formulaire"
                picto={<OrderSvg />}
              />
            )}
          </aside>
        </div>
      </Container>
    </Layout>
  );
};

export default MotorisationForm;

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();

  return {
    props: {
      ...commonData,
    },
    revalidate: 36000,
  };
};
