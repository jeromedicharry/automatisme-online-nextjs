// Components
import Layout from '@/components/Layout/Layout';

// Types
import type { GetStaticProps } from 'next';
import Container from '@/components/container';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { Wifi } from '@/components/SVG/Icons';
import BlocIntroForm from '@/components/atoms/BlocIntroForm';
import { ThemeSettingsProps } from '@/types/CptTypes';
import ContactForm from '@/components/CF7Forms/Contact';

// import { CardProductProps } from '@/types/blocTypes';

const contactPage = ({
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
  return (
    <Layout
      meta={{ title: 'Contactez Automatisme Online' }}
      uri={'/contact'}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isBg
      excludeSeo
      totalProducts={totalProducts}
    >
      <Container>
        <div className="md:max-w-[700px] mx-auto">
          <div className="mt-10 relative z-0 overflow-hidden bg-primary-light-alt rounded-2xl p-4 md:p-8 lg:p-16">
            <div className={`absolute bottom-[-8px] right-[-8px] w-1/2 z-[-1]`}>
              <Wifi variant="bleu2" />
            </div>
            <div className="flex gap-4 items-center mb-4 max-md:justify-center md:mb-10">
              <div className="w-6 md:w-10">
                <SvgEnveloppe />
              </div>
              <BlocIntroForm
                title={themeSettings?.contactTitle || 'Contactez-nous'}
              />
            </div>
            <ContactForm />
          </div>
          <div
            className="my-16 wysiwyg"
            dangerouslySetInnerHTML={{
              __html: themeSettings?.contactText || '',
            }}
          />
        </div>
      </Container>
    </Layout>
  );
};

export default contactPage;

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();

  return {
    props: {
      ...commonData,
    },
    revalidate: 3600000,
  };
};

export const SvgEnveloppe = () => {
  return (
    <svg
      width="40"
      height="38"
      viewBox="0 0 40 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.6664 0.0527344H8.33357C3.73322 0.0592517 0.00630616 3.91096 0 8.66532V29.3349C0.00630616 34.0892 3.73322 37.941 8.33357 37.9475H31.6664C36.2667 37.941 39.9937 34.0892 40 29.3349V8.66532C39.9937 3.91096 36.2667 0.0592517 31.6664 0.0527344ZM8.33357 3.49712H31.6664C33.7064 3.50038 35.5415 4.78754 36.2983 6.74599L23.5346 19.937C21.5796 21.9508 18.4171 21.9508 16.4622 19.937L3.69856 6.74599C4.4553 4.78754 6.29037 3.50038 8.33041 3.49712H8.33357ZM31.6664 34.4966H8.33357C5.57147 34.4966 3.33283 32.1829 3.33283 29.3284V11.2429L14.1069 22.3679C17.364 25.7243 22.636 25.7243 25.8931 22.3679L36.6672 11.2429V29.3284C36.6672 32.1829 34.4285 34.4966 31.6664 34.4966Z"
        fill="currentColor"
      />
    </svg>
  );
};
