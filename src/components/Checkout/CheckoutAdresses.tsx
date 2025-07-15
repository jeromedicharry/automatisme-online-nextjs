import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALEX_SHIPPING_METHOD } from '@/utils/gql/GQL_MUTATIONS';
import {
  GET_CUSTOMER_ADDRESSES,
  UPDATE_ADDRESS,
} from '@/utils/gql/CUSTOMER_QUERIES';
import useAuth from '@/hooks/useAuth';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import { AddressData } from '../Account/addresses';
import AccountLoader from '../Account/AccountLoader';
import AddressForm from '../Account/addresses/AddressForm';
import AddressCard from '../Account/addresses/AddressCard';
import EmptyAddressWithCTA from '../Account/addresses/EmptyAddressWithCta';

const CheckoutAdresses = ({
  setCanProceed,
}: {
  setCanProceed: (value: boolean) => void;
}) => {
  const { user, loggedIn } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<
    null | 'billing' | 'shipping'
  >(null);
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(false);

  const { refetch: refetchShippingMethods } = useQuery(GET_ALEX_SHIPPING_METHOD);

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
          variables.billing = {
            ...addressData,
            email: billing?.email || addressData.email,
          };
        }
      }

      await updateAddress({
        variables,
      });

      await Promise.all([
        refetch(),
        refetchShippingMethods()
      ]);
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

  const { shipping, billing } = data?.customer || {};

  const isAddressComplete = (address: AddressData) => {
    return address && address.address1 && address.city;
  };

  const hasShippingAddress = isAddressComplete(shipping);
  const hasBillingAddress = isAddressComplete(billing);

  useEffect(() => {
    const canProceedToNextStep = Boolean(
      hasShippingAddress && hasBillingAddress,
    );
    setCanProceed(canProceedToNextStep);
  }, [hasShippingAddress, hasBillingAddress, setCanProceed]);

  return (
    <section>
      <BlocIntroSmall
        title="Confirmez votre adresse de livraison"
        // subtitle="Assurez-vous que vous avez renseigné vos adresses de livraison et de facturation."
      />

      {loading && <AccountLoader text="Chargement des adresses..." />}

      {error && (
        <p className="text-red-500 p-6 border border-red-500 text-center w-fit mx-auto mb-6">
          Erreur de chargement : {error.message}
        </p>
      )}

      {!loggedIn && (
        <div className="text-center py-8">
          <p>Veuillez vous connecter pour gérer vos adresses.</p>
        </div>
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
        <div className="space-y-10 md:space-y-6">
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
          <BlocIntroSmall title="Confirmez votre adresse de facturation" />

          {hasBillingAddress ? (
            <AddressCard
              address={billing}
              type="billing"
              onEdit={() => handleEdit('billing')}
            />
          ) : (
            hasShippingAddress && (
              <EmptyAddressWithCTA
                type="billing"
                onAddAddress={() => handleAddressCreation('billing')}
              />
            )
          )}
        </div>
      )}
    </section>
  );
};

export default CheckoutAdresses;
