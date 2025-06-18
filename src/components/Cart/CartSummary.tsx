import { useContext } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { CartContext } from '@/stores/CartProvider';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import Cta from '../atoms/Cta';
import Separator from '../atoms/Separator';
import CartReassurance from './CartReassurance';
import { useCartOperations } from '@/hooks/useCartOperations';
import {
  GET_CART_SHIPPING_METHODS,
  GET_CART_SHIPPING_INFO,
  GET_CART,
} from '@/utils/gql/WOOCOMMERCE_QUERIES';
import CartReassuranceBis from './CartReassuranceBis';

const CartSummary = ({ isCheckout = false }: { isCheckout?: boolean }) => {
  const { cart } = useContext(CartContext);
  const { isPro } = useCartOperations();

  const { data: shippingMethodsData } = useQuery(GET_CART_SHIPPING_METHODS);
  const { data: shippingInfoData } = useQuery(GET_CART_SHIPPING_INFO);
  const { data: cartData } = useQuery(GET_CART);

  interface ShippingMethod {
    cost: string;
    methodId: string;
    label: string;
    instanceId: number;
  }

  const selectedShippingMethod =
    shippingMethodsData?.cart?.availableShippingMethods[0]?.rates?.find(
      (method: ShippingMethod) => {
        const chosenMethod = shippingInfoData?.cart?.chosenShippingMethods[0];
        return (
          chosenMethod &&
          `${method.methodId}:${method.instanceId}` === chosenMethod
        );
      },
    );

  // Todo gérer la TVA pour l'installation

  if (!cart || !cart.products) {
    return null;
  }

  // Calcul du coût total TTC des installations
  const totalInstallationCost = cart.products.reduce((total, product) => {
    if (product.addInstallation && product.installationPrice) {
      return total + product.installationPrice;
    }
    return total;
  }, 0);

  // Calcul du coût total HT des installations
  const totalInstallationHT = totalInstallationCost / 1.2;

  // TVA sur les installations
  const totalInstallationTVA = totalInstallationCost - totalInstallationHT;

  // Calcul du coût total des produits (sans installation)
  const cartTotal = parseFloat((cartData?.cart?.total || 0).toString());

  // Calcul du coût de livraison
  const shippingCost = selectedShippingMethod
    ? parseFloat(selectedShippingMethod.cost)
    : 0;

  // Grand total incluant produits, installations et livraison
  const grandTotal = cartTotal + totalInstallationCost + shippingCost;

  return (
    <>
      <BlocIntroSmall title="Récapitulatif" />

      {/* Version mobile */}
      <div className="md:hidden p-6 bg-white rounded-lg shadow-card w-full">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <strong>Total panier</strong>
            <div className="text-xl">TTC: {grandTotal.toFixed(2)}€</div>
            <div className="text-sm text-dark-grey">
              Total HT: {(grandTotal - cart.totalTax).toFixed(2)}€
            </div>
            {totalInstallationCost > 0 && (
              <div className="text-sm text-dark-grey">
                Dont installation: {totalInstallationCost.toFixed(2)}€
              </div>
            )}
          </div>
          <Cta
            slug="/caisse"
            label="Continuer"
            size="default"
            variant="primary"
            isFull
            disabled={!selectedShippingMethod}
          >
            Continuer
          </Cta>
        </div>
      </div>

      {/* Version desktop */}
      <div className="max-md:hidden p-4 bg-white rounded-lg shadow-card flex flex-col gap-4 items-stretch">
        {cart.products.map((product, index) => (
          <div key={index}>
            {/* Produit */}
            <Link
              title="Voir le produit"
              href={`/nos-produits/${product.slug}`}
              className="flex gap-1 justify-between items-center mb-2"
            >
              <div className="font-bold shrink-1 overflow-hidden text-ellipsis break-words whitespace-pre-line line-clamp-2">
                {product.name}
                <span className="block font-normal text-sm text-dark-grey">
                  Qté: {product.qty}
                </span>
              </div>
              <div className="font-bold relative pr-7">
                {(product.price * product.qty).toFixed(2)}€
                <span className="absolute right-0 top-0 text-xs">
                  {isPro ? 'HT' : 'TTC'}
                </span>
              </div>
            </Link>

            {/* Installation si présente */}
            {product.addInstallation ? (
              <div className="flex justify-between items-center mb-2 text-sm">
                <div className="flex items-center">
                  {/* <div className="flex items-center justify-center w-[60px] h-[60px]">
                    <div className="w-[20px] h-[20px] bg-secondary rounded-full"></div>
                  </div> */}
                  <div className="font-bold shrink-1 overflow-hidden text-ellipsis break-words whitespace-pre-line line-clamp-2">
                    {"Frais d'installation"}
                  </div>
                </div>
                <div className="font-bold text-primary relative pr-7">
                  {product.installationPrice?.toFixed(2)}€
                  <span className="absolute right-0 top-0 text-xs">
                    {isPro ? 'HT' : 'TTC'}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ))}

        <Separator />
        {/* Affichage du coût total des installations */}
        {totalInstallationCost > 0 && (
          <>
            <div className="text-dark-grey flex justify-between gap-6 items-center">
              <p>Total installation</p>
              <data className="relative pr-7">
                {totalInstallationCost.toFixed(2)}€
                <span className="absolute right-0 top-0 text-xs">
                  {isPro ? 'HT' : 'TTC'}
                </span>
              </data>
            </div>
          </>
        )}
        <div>
          <div className="text-dark-grey flex justify-between gap-6 items-center">
            <p>
              {'Livraison: '}
              {selectedShippingMethod
                ? selectedShippingMethod.label
                : 'Livraison non sélectionnée'}
            </p>
            <data className="relative pr-7">
              {selectedShippingMethod ? `${selectedShippingMethod.cost}€` : '-'}
              {selectedShippingMethod && (
                <span className="absolute right-0 top-0 text-xs">
                  {isPro ? 'HT' : 'TTC'}
                </span>
              )}
            </data>
          </div>
        </div>

        <Separator />
        <div>
          <div className="flex text-primary justify-between gap-6 items-center">
            <p>Total Produits HT</p>
            <p>
              {parseFloat((cartData?.cart?.subtotal || 0).toString()).toFixed(
                2,
              )}
              €
            </p>
          </div>

          <div className="flex text-primary justify-between gap-6 items-center mt-1">
            <p>TVA Produits</p>
            <p>
              {parseFloat((cartData?.cart?.totalTax || 0).toString()).toFixed(
                2,
              )}
              €
            </p>
          </div>

          <div className="flex text-primary font-bold justify-between gap-6 items-center mt-2">
            <p>Total Produits TTC</p>
            <p>
              {parseFloat((cartData?.cart?.total || 0).toString()).toFixed(2)}€
            </p>
          </div>

          {/* Affichage du grand total incluant les installations */}
          {totalInstallationCost > 0 && (
            <>
              <div className="flex text-primary justify-between gap-6 items-center mt-3">
                <p>Installation HT</p>
                <p>{totalInstallationHT.toFixed(2)}€</p>
              </div>
              <div className="flex text-primary justify-between gap-6 items-center mt-1">
                <p>TVA Installation (20%)</p>
                <p>{totalInstallationTVA.toFixed(2)}€</p>
              </div>
              {selectedShippingMethod && (
                <>
                  <div className="flex text-primary justify-between gap-6 items-center mt-2">
                    <p>Livraison HT ({selectedShippingMethod.label})</p>
                    <p>
                      {(
                        parseFloat(selectedShippingMethod.cost) -
                        parseFloat(
                          (cartData?.cart?.shippingTax || 0).toString(),
                        )
                      ).toFixed(2)}
                      €
                    </p>
                  </div>
                  {cartData?.cart?.shippingTax > 0 && (
                    <div className="flex text-primary justify-between gap-6 items-center mt-1">
                      <p>TVA Livraison</p>
                      <p>
                        {parseFloat(
                          (cartData?.cart?.shippingTax || 0).toString(),
                        ).toFixed(2)}
                        €
                      </p>
                    </div>
                  )}
                  <div className="flex text-primary justify-between gap-6 items-center mt-1">
                    <p>Livraison TTC</p>
                    <p>{selectedShippingMethod.cost}€</p>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex text-primary justify-between gap-6 items-center mt-2">
                <p>Total TVA</p>
                <p>{cartData?.cart?.totalTax || 0}€</p>
              </div>
              <div className="flex text-primary font-bold justify-between gap-6 items-center mt-2">
                <p>Total TTC</p>
                <p>{grandTotal.toFixed(2)}€</p>
              </div>
            </>
          )}
        </div>
        {!isCheckout && (
          <>
            <Separator />
            <Cta
              slug="/caisse"
              label="Continuer"
              size="default"
              variant="primary"
              isFull
            >
              Continuer
            </Cta>
          </>
        )}
        <CartReassurance />
      </div>
      <div className="max-md-hidden mt-4">
        <CartReassuranceBis />
      </div>
    </>
  );
};

export default CartSummary;
