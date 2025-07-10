import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import { CartContext } from '@/stores/CartProvider';
import { useCartOperations } from '@/hooks/useCartOperations';
import { UPDATE_CART_ITEM_INSTALLATION } from '@/utils/gql/GQL_MUTATIONS';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';

const InstallationVAT = ({
  poseReducedTvForm,
}: {
  poseReducedTvForm: string;
}) => {
  const { cart } = useContext(CartContext);
  const { refetchCart } = useCartOperations();
  const [hasReducedTvaRate, setHasReducedTvaRate] = useState(false);
  const [updateCartItemInstallation] = useMutation(
    UPDATE_CART_ITEM_INSTALLATION,
    {
      refetchQueries: [{ query: GET_CART }],
      awaitRefetchQueries: true,
      onCompleted: async () => {
        await refetchCart();
      },
      onError: (error) => {
        console.error('Error updating installation TVA:', error);
      },
    },
  );

  const handleTvaRateChange = async (checked: boolean) => {
    setHasReducedTvaRate(checked);

    // Mettre à jour tous les produits du panier qui ont une installation
    if (cart?.products) {
      for (const product of cart.products) {
        if (product.addInstallation) {
          await updateCartItemInstallation({
            variables: {
              cartItemKey: product.cartKey,
              addInstallation: true,
              hasReducedTvaRate: checked,
            },
          });
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-card">
      <BlocIntroSmall
        title="TVA réduite à 10% sur les frais d'installation"
        subtitle="Veuillez cocher cette case et nous retourner le formulaire si vous êtes éligible "
      />
      <form className="mt-4">
        <label className="flex items-start gap-4 text-sm text-dark-grey cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-secondary duration-300"
            checked={hasReducedTvaRate}
            onChange={(e) => handleTvaRateChange(e.target.checked)}
          />
          <span>
            Je certifie bénéficier de la TVA réduite de 10%,{' '}
            <a
              href={poseReducedTvForm}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="underline text-secondary duration-300 hover:text-primary"
            >
              je télécharge
            </a>{' '}
            ce formulaire et vous le renvoie complété (cette installation
            concerne une maison d&apos;habitation construite il y a plus de deux
            ans)
          </span>
        </label>
      </form>
    </div>
  );
};

export default InstallationVAT;
