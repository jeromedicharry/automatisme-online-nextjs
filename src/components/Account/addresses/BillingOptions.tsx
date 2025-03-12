import React from 'react';

interface BillingOptionsProps {
  onUseSameAddress: () => void;
  onAddNewAddress: () => void;
}

const BillingOptions: React.FC<BillingOptionsProps> = ({
  onUseSameAddress,
  onAddNewAddress,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Adresse de facturation</h3>
      <div className="flex items-center mb-4">
        <button onClick={onUseSameAddress} className="btn btn-secondary mr-4">
          {"Utiliser l'adresse de livraison"}
        </button>
        <span>ou</span>
        <button onClick={onAddNewAddress} className="btn btn-primary ml-4">
          Ajouter une nouvelle adresse
        </button>
      </div>
    </div>
  );
};

export default BillingOptions;
