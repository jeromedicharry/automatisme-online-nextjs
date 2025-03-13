import Cta from '@/components/atoms/Cta';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import React, { useState, useEffect } from 'react';
import { AddressData } from '.';
import { COUNTRIES_LIST } from '@/utils/constants/COUNTRIES_LIST';

interface AddressFormProps {
  addressType: 'shipping' | 'billing' | null;
  initialData: AddressData;
  onSubmit: (addressData: AddressData) => void;
  onCancel: () => void;
  isBillingSameAsShipping: boolean;
  setIsBillingSameAsShipping: (value: boolean) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  addressType,
  initialData,
  onSubmit,
  onCancel,
  isBillingSameAsShipping,
  setIsBillingSameAsShipping,
}) => {
  const [addressData, setAddressData] = useState({
    address1: '',
    address2: '',
    city: '',
    company: '',
    country: '',
    firstName: '',
    lastName: '',
    phone: '',
    postcode: '',
    email: '',
  });

  useEffect(() => {
    if (initialData) {
      setAddressData({
        address1: initialData.address1 || '',
        address2: initialData.address2 || '',
        city: initialData.city || '',
        company: initialData.company || '',
        country: initialData.country || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        phone: initialData.phone || '',
        postcode: initialData.postcode || '',
        email: initialData.email || '',
      });
    }
  }, [initialData]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(addressData);
  };

  const handleBillingSameAsShipping = () => {
    setIsBillingSameAsShipping(!isBillingSameAsShipping);
  };

  const title =
    addressType === 'shipping'
      ? 'Adresse de livraison'
      : 'Adresse de facturation';

  return (
    <div className="border rounded-lg p-6 bg-white shadow-card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block mb-1">
              Prénom
            </label>
            <input
              id="firstName"
              value={addressData.firstName}
              onChange={(e) =>
                setAddressData({ ...addressData, firstName: e.target.value })
              }
              required
              type="text"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-1">
              Nom
            </label>
            <input
              id="lastName"
              value={addressData.lastName}
              onChange={(e) =>
                setAddressData({ ...addressData, lastName: e.target.value })
              }
              required
              type="text"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block mb-1">
            Société (optionnel)
          </label>
          <input
            id="company"
            value={addressData.company}
            onChange={(e) =>
              setAddressData({ ...addressData, company: e.target.value })
            }
            type="text"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="address1" className="block mb-1">
            Adresse
          </label>
          <input
            id="address1"
            value={addressData.address1}
            onChange={(e) =>
              setAddressData({ ...addressData, address1: e.target.value })
            }
            required
            type="text"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="address2" className="block mb-1">
            {"Complément d'adresse (optionnel)"}
          </label>
          <input
            id="address2"
            value={addressData.address2 || ''}
            onChange={(e) =>
              setAddressData({ ...addressData, address2: e.target.value })
            }
            type="text"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="postcode" className="block mb-1">
              Code postal
            </label>
            <input
              id="postcode"
              value={addressData.postcode || ''}
              onChange={(e) =>
                setAddressData({ ...addressData, postcode: e.target.value })
              }
              required
              type="text"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="city" className="block mb-1">
              Ville
            </label>
            <input
              id="city"
              value={addressData.city || ''}
              onChange={(e) =>
                setAddressData({ ...addressData, city: e.target.value })
              }
              required
              type="text"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block mb-1">
              Pays
            </label>
            <select
              id="country"
              value={addressData.country || ''}
              onChange={(e) =>
                setAddressData({ ...addressData, country: e.target.value })
              }
              required
              className="w-full p-2 pr-4 border rounded"
            >
              <option value="" disabled>
                Sélectionnez un pays
              </option>
              {COUNTRIES_LIST.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1">
              Téléphone (optionnel)
            </label>
            <input
              id="phone"
              value={addressData.phone || ''}
              onChange={(e) =>
                setAddressData({ ...addressData, phone: e.target.value })
              }
              type="tel"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {addressType === 'billing' && (
          <div>
            <label htmlFor="email" className="block mb-1">
              Email de facturation
            </label>
            <input
              id="email"
              value={addressData.email || ''}
              onChange={(e) =>
                setAddressData({ ...addressData, email: e.target.value })
              }
              required
              type="email"
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {addressType === 'shipping' && (
          <div className="flex items-center gap-2 mt-4">
            <ToggleSwitch
              id="sameAsBilling"
              checked={isBillingSameAsShipping}
              onChange={handleBillingSameAsShipping}
              label="Utiliser la même adresse pour la facturation"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8 md:mt-12 w-fit ml-auto">
          <Cta
            slug="#"
            handleButtonClick={onCancel}
            variant="primaryHollow"
            label="Annuler"
          >
            Annuler
          </Cta>
          <button
            type="submit"
            className="text-base leading-general px-4 py-2 gap-2 bg-primary duration-300 hover:bg-primary-dark text-white min-h-[43px] rounded-[5px] min-w-[170px]"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
