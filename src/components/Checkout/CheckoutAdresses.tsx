import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CUSTOMER_ADDRESSES,
  UPDATE_ADDRESS,
} from '@/utils/gql/CUSTOMER_QUERIES';
import useAuth from '@/hooks/useAuth';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import { stepTypes } from '.';
import { AddressData } from '../Account/addresses';
import AccountLoader from '../Account/AccountLoader';
import AddressForm from '../Account/addresses/AddressForm';
import AddressCard from '../Account/addresses/AddressCard';
import EmptyAddressWithCTA from '../Account/addresses/EmptyAddressWithCta';
import Cta from '../atoms/Cta';

const CheckoutAdresses = ({
  setCurrentStep,
}: {
  setCurrentStep: (step: stepTypes) => void;
}) => {
  const { user, loggedIn, isPro } = useAuth();
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
          variables.billing = {
            ...addressData,
            email: billing?.email || addressData.email,
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

  const { shipping, billing } = data?.customer || {};

  const isAddressComplete = (address: AddressData) => {
    return address && address.address1 && address.city;
  };

  const hasShippingAddress = isAddressComplete(shipping);
  const hasBillingAddress = isAddressComplete(billing);

  const canProceed = hasShippingAddress && hasBillingAddress;

  return (
    <main>
      <BlocIntroSmall
        title="Informations de livraison et facturation"
        subtitle="Assurez-vous que vous avez renseigné vos adresses de livraison et de facturation."
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

          <div className="flex justify-start max-md:flex-col max-md:items-stretch mt-6 md:w-fit gap-4 ml-auto">
            <Cta
              slug="/panier"
              label="Retourner au panier"
              size="default"
              variant="primaryHollow"
              additionalClass="max-md:w-full"
            >
              {'Retourner au panier'}
            </Cta>
            <Cta
              slug="#"
              label="Continuer"
              handleButtonClick={() =>
                setCurrentStep(isPro ? 'ProInfos' : 'ShippingMethod')
              }
              disabled={!canProceed}
              size="default"
              variant="primary"
              additionalClass="max-md:w-full"
            >
              Continuer
            </Cta>
          </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutAdresses;
