import Cta from '@/components/atoms/Cta';
import EmptyElement from '@/components/EmptyElement';
import { HouseSvg } from '@/components/SVG/Icons';
import React from 'react';

interface EmptyAddressWithCTAProps {
  type: 'shipping' | 'billing';
  onAddAddress: () => void;
}

const EmptyAddressWithCTA: React.FC<EmptyAddressWithCTAProps> = ({
  type,
  onAddAddress,
}) => {
  const title =
    type === 'shipping' ? 'Adresse de livraison' : 'Adresse de facturation';

  return (
    <div className="mb-6">
      <EmptyElement
        picto={<HouseSvg />}
        title={`${title} obligatoire et non renseignée`}
        subtitle={`Ajoutez une ${type === 'shipping' ? 'adresse de livraison' : 'adresse de facturation'} pour faciliter vos prochaines commandes.`}
      />

      <div className="py-4 px-5 bg-white shadow-card rounded-lg w-full mt-4 align-left">
        <div className="w-fit">
          <Cta
            slug="#"
            handleButtonClick={onAddAddress}
            variant="primaryHollow"
            size="small"
            label="Ajouter une adresse de livraison"
            isFull={false}
            additionalClass="items-start"
          >
            Ajouter une adresse
          </Cta>
        </div>
      </div>
    </div>
  );
};

export default EmptyAddressWithCTA;
