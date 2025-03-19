import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CUSTOMER_ADDRESSES,
  UPDATE_ADDRESS,
} from '@/utils/gql/CUSTOMER_QUERIES';
import useAuth from '@/hooks/useAuth';
import BackToAccountNav from '../BackToAccountNav';
import EmptyAddressWithCTA from '../addresses/EmptyAddressWithCta';
import AddressForm from '../addresses/AddressForm';
import AddressCard from '../addresses/AddressCard';
import BillingOptions from '../addresses/BillingOptions';

export type AddressData = {
  address1: string;
  address2: string;
  city: string;
  company: string;
  country: string;
  firstName: string;
  lastName: string;
  phone: string;
  postcode: string;
  email?: string;
};

const Pro = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, loggedIn } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<
    null | 'billing' | 'shipping'
  >(null);
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER_ADDRESSES, {
    variables: { id: user?.id },
    skip: !loggedIn,
  });

  const [updateAddress] = useMutation(UPDATE_ADDRESS);

  const handleEdit = (addressType: 'billing' | 'shipping') => {
    setSelectedAddress(addressType);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedAddress(null);
  };

  const handleSubmit = async (addressData: AddressData) => {
    if (!user?.id) return;

    try {
      const variables: {
        id: string;
        billing?: AddressData;
        shipping?: AddressData;
      } = {
        id: user.id,
      };

      if (selectedAddress === 'billing') {
        variables.billing = addressData;
      }

      if (selectedAddress === 'shipping') {
        variables.shipping = addressData;

        if (isBillingSameAsShipping) {
          // Si billing est mis à jour aussi, on s'assure de garder l'email existant
          variables.billing = {
            ...addressData,
            email: billing?.email || addressData.email, // Préserve l'email
          };
        }
      }
      await updateAddress({
        variables,
      });

      await refetch();
      setIsEditing(false);
      setSelectedAddress(null);
    } catch (error) {
      console.error('Error updating address', error);
    }
  };

  const handleAddressCreation = (addressType: 'shipping' | 'billing') => {
    setSelectedAddress(addressType);
    setIsEditing(true);
  };

  const handleUseSameAsBilling = () => {
    if (data?.customer?.shipping) {
      setSelectedAddress('billing');
      setIsEditing(true);
      setIsBillingSameAsShipping(true);
    }
  };

  const handleAddNewBilling = () => {
    setSelectedAddress('billing');
    setIsEditing(true);
    setIsBillingSameAsShipping(false);
  };

  if (loading) return <div className="p-4">Chargement des adresses...</div>;
  if (error)
    return <div className="p-4 text-red-500">Erreur: {error.message}</div>;

  const { shipping, billing } = data?.customer || {};

  const isAddressComplete = (address: AddressData) => {
    return address && address.address1 && address.city;
  };

  const hasShippingAddress = isAddressComplete(shipping);
  const hasBillingAddress = isAddressComplete(billing);

  return (
    <>
      <div className="md:hidden">
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>
      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6">
        Mes adresses
      </h1>

      {!loggedIn && (
        <div className="text-center py-8">
          <p>Veuillez vous connecter pour gérer vos adresses.</p>
        </div>
      )}

      {loggedIn && !hasShippingAddress && !isEditing && (
        <>
          <EmptyAddressWithCTA
            type="shipping"
            onAddAddress={() => handleAddressCreation('shipping')}
          />
        </>
      )}

      {loggedIn && isEditing && (
        <AddressForm
          addressType={selectedAddress}
          initialData={selectedAddress === 'shipping' ? shipping : billing}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isBillingSameAsShipping={isBillingSameAsShipping}
          setIsBillingSameAsShipping={setIsBillingSameAsShipping}
        />
      )}

      {loggedIn && !isEditing && (
        <div className="space-y-6">
          {hasShippingAddress ? (
            <AddressCard
              address={shipping}
              type="shipping"
              onEdit={() => handleEdit('shipping')}
            />
          ) : (
            <EmptyAddressWithCTA
              type="shipping"
              onAddAddress={() => handleAddressCreation('shipping')}
            />
          )}

          {hasShippingAddress && !hasBillingAddress && !isEditing && (
            <BillingOptions
              onUseSameAddress={handleUseSameAsBilling}
              onAddNewAddress={handleAddNewBilling}
            />
          )}

          {hasBillingAddress ? (
            <AddressCard
              address={billing}
              type="billing"
              onEdit={() => handleEdit('billing')}
            />
          ) : (
            hasShippingAddress &&
            !isEditing && (
              <EmptyAddressWithCTA
                type="billing"
                onAddAddress={() => handleAddressCreation('billing')}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default Pro;
