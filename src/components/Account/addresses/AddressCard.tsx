import Cta from '@/components/atoms/Cta';
import { formatPhoneNumber, getCountryName } from '@/utils/functions/functions';
import React from 'react';

interface AddressCardProps {
  address: any;
  type: 'shipping' | 'billing';
  onEdit: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, type, onEdit }) => {
  const title =
    type === 'shipping' ? 'Adresse de livraison' : 'Adresse de facturation';

  return (
    <div className="border rounded-lg py-4 px-5 mb-4 relative bg-white shadow-card">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="absolute top-4 right-5">
        <Cta
          handleButtonClick={onEdit}
          variant="primary"
          size="small"
          label="Modifier"
          slug="#"
        >
          Modifier
        </Cta>
      </div>
      <p>
        {address.firstName} {address.lastName}
      </p>
      {address.company && <p>{address.company}</p>}
      <p>{address.address1}</p>
      {address.address2 && <p>{address.address2}</p>}
      <p>
        {address.postcode} {address.city}
      </p>
      <p>{getCountryName(address.country)}</p>
      {address.phone && (
        <p className="mt-4">{formatPhoneNumber(address.phone)}</p>
      )}
      {address.email && (
        <div className="mt-4">
          <h3 className="font-semibold mb-4">Email de facturation</h3>
          <p>{address.email}</p>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
