import Logo from '@/components/atoms/Logo';
import Container from '@/components/container';
import SimpleFooterMenu, { SimpleFooterMenuProps } from './SimpleFooterMenu';
import ContactMenu from './ContactMenu';
import PaymentMethods from './PaymentMethods';
import Newsletter from './Newsletter';
import BlocReassurance from '../blocs/BlocReassurance';
import FooterAccordion from './FooterAccordion';
import { DoubleLevelFooterMenuProps } from '@/components/Layout/Layout';

/**
 * Renders Footer of the application.
 * @function Footer
 * @returns {JSX.Element} - Rendered component
 */
const Footer = ({
  menu1,
  menu2,
  menu3,
  themeSettings,
}: {
  menu1: SimpleFooterMenuProps | undefined;
  menu2: SimpleFooterMenuProps | undefined;
  menu3: DoubleLevelFooterMenuProps | undefined;
  themeSettings: any;
}) => (
  <>
    <div className="bg-primary-light">
      <BlocReassurance
        bloc={{
          __typename: 'AcfPageBlocsBlocReassuranceLayout',
          isAvis: false,
          type: 'Fond bleu clair',
        }}
        reassuranceItems={themeSettings?.reassurance}
        isFooter={true}
      />
    </div>
    <footer className="bg-primary pt-10 pb-14">
      <Container>
        <div className="flex md:flex-wrap flex-col md:flex-row items-center md:items-start md:justify-between gap-10 md:gap-6 max-md:max-w-md mx-auto">
          <div className="flex flex-col gap-14 md:gap-6 max-sm:items-stretch max-sm:w-full">
            <div className="self-center">
              <Logo isFooter />
            </div>
            <Newsletter />
          </div>
          <SimpleFooterMenu menu={menu1} />
          <ContactMenu themeSettings={themeSettings} />
          <SimpleFooterMenu menu={menu2} />
          <PaymentMethods themeSettings={themeSettings} />
        </div>
      </Container>
      <Container>
        {menu3 && (
          <div className="mt-10">
            <FooterAccordion menuItems={menu3.menuItems.nodes} />
          </div>
        )}
      </Container>
    </footer>
  </>
);

export default Footer;

export const SubmitSvg = () => (
  <svg
    width="32"
    height="33"
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="0.476074" width="32" height="32" rx="16" fill="currentColor" />
    <path
      d="M15.3752 12.396L19.0024 15.4619C19.6659 16.0227 19.6659 16.9201 19.0024 17.4809L15.3752 20.5561C14.3136 21.4534 12.5 20.8178 12.5 19.5466L12.5 13.4055C12.5 12.1343 14.3136 11.4987 15.3752 12.396Z"
      fill="#FFF"
    />
  </svg>
);
