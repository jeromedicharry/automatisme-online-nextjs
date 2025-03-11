import React from 'react';
import Cta from '../atoms/Cta';
import { ArrowLeft } from 'lucide-react';

const BackToAccountNav = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Cta
      label="Compte"
      slug="#"
      handleButtonClick={(e) => {
        e.preventDefault();
        setMobileNavClosed(false);
      }}
      size="default"
      variant="primary"
    >
      <div className="w-4">
        <ArrowLeft />
      </div>{' '}
      Retour au compte
    </Cta>
  );
};

export default BackToAccountNav;
