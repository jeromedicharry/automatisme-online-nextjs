import { useContext } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import { CartContext } from '@/stores/CartProvider';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import Cta from '../atoms/Cta';
import Separator from '../atoms/Separator';
import CartReassurance from './CartReassurance';
import { useCartOperations } from '@/hooks/useCartOperations';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import {
  GET_ALEX_SHIPPING_METHOD,
  REMOVE_COUPON,
} from '@/utils/gql/GQL_MUTATIONS';
import CartReassuranceBis from './CartReassuranceBis';
import CouponForm from './CouponForm';

const CartSummary = ({ isCheckout = false }: { isCheckout?: boolean }) => {
  const { cart } = useContext(CartContext);
  const { isPro } = useCartOperations();

  const { data: shippingMethodsData } = useQuery(GET_ALEX_SHIPPING_METHOD);
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART);

  interface ShippingMethod {
    id: string;
    label: string;
    cost: string;
    delayMin: number;
    delayMax: number;
    description: string;
  }

  const chosenMethod = shippingMethodsData?.cart?.chosenShippingMethods?.[0];
  const availableShippingMethods =
    shippingMethodsData?.cart?.dynamicShippingMethods || [];

  // Recherche de la méthode sélectionnée
  let selectedShippingMethod = null;

  if (availableShippingMethods.length > 0 && chosenMethod) {
    // Si c'est une méthode relais, chercher la méthode carrier_dynamic correspondante
    if (chosenMethod === 'carrier_dynamic_relais') {
      selectedShippingMethod = availableShippingMethods.find(
        (method: ShippingMethod) => {
          const isMatch =
            method.id === 'carrier_dynamic' &&
            method.label.toLowerCase().includes('relais');
          return isMatch;
        },
      );
    } else {
      selectedShippingMethod = availableShippingMethods.find(
        (method: ShippingMethod) => {
          const isMatch = method.id === chosenMethod;
          return isMatch;
        },
      );
    }
  }

  // Récupération des coupons appliqués depuis l'API
  const appliedCoupons = cartData?.cart?.appliedCoupons || [];
  const discountHT = parseFloat(cartData?.cart?.discountTotalRaw || '0');
  const discountTVA = parseFloat(cartData?.cart?.discountTaxRaw || '0');
  const totalDiscountAmount = discountHT + discountTVA;

  // Mutation pour supprimer un coupon
  const [removeCoupon, { loading: removeCouponLoading }] = useMutation(
    REMOVE_COUPON,
    {
      onCompleted: () => {
        refetchCart();
      },
    },
  );

  // Fonction pour supprimer un coupon
  const handleRemoveCoupon = async (code: string) => {
    if (removeCouponLoading) return;
    try {
      await removeCoupon({
        variables: {
          code,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du coupon:', error);
    }
  };

  // Todo gérer la TVA pour l'installation

  if (!cart || !cart.products) {
    return null;
  }

  // Montants d'installation depuis l'API
  const totalInstallationHT = parseFloat(cartData?.cart?.feeTotal || '0');
  const totalInstallationTVA = parseFloat(cartData?.cart?.feeTax || '0');
  const totalInstallationTTC = totalInstallationHT + totalInstallationTVA;

  // Calcul du coût total des produits (sans installation)
  const productTotalHT = parseFloat(cartData?.cart?.subtotal || '0');
  const productTVA = parseFloat(cartData?.cart?.subtotalTax || '0');
  const productTotalTTC = productTotalHT + productTVA;

  // Grand total depuis l'API
  const grandTotal = parseFloat(cartData?.cart?.total || '0');

  // Handler pour rafraîchir le panier après application/suppression de coupon
  const handleCouponChange = () => {
    refetchCart();
  };

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
              Total HT:{' '}
              {(
                grandTotal - parseFloat(cartData?.cart?.totalTax || '0')
              ).toFixed(2)}
              €
            </div>
            <div className="text-sm text-dark-grey">
              Total TVA:{' '}
              {parseFloat(cartData?.cart?.totalTax || '0').toFixed(2)}€
            </div>
            {totalInstallationTTC > 0 && (
              <div className="text-sm text-dark-grey">
                Dont installation: {totalInstallationTTC.toFixed(2)}€
              </div>
            )}
            {appliedCoupons.length > 0 && (
              <div className="text-sm text-green-600">
                <div>Remise: -{totalDiscountAmount.toFixed(2)}€</div>
                <div className="mt-1">
                  {appliedCoupons.map((coupon: any) => (
                    <div
                      key={coupon.code}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span>Code: {coupon.code}</span>
                        <span className="text-green-600">
                          (-
                          {(
                            parseFloat(coupon.discountAmount) +
                            parseFloat(coupon.discountTax)
                          ).toFixed(2)}
                          € TTC)
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveCoupon(coupon.code)}
                        className="text-red-500 hover:text-red-700 text-xs"
                        disabled={removeCouponLoading}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Formulaire coupon version mobile */}
          <CouponForm
            appliedCoupons={appliedCoupons}
            onCouponApplied={handleCouponChange}
          />
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
              className="flex gap-2 justify-between items-center mb-2"
            >
              <div className="font-bold shrink-1 overflow-hidden">
                <div className="line-clamp-2 text-balance">{product.name}</div>
                <span className="block font-normal text-sm text-dark-grey">
                  Qté: {product.qty}
                </span>
              </div>
              <div className="font-bold relative pr-7">
                {product.price.toFixed(2)}€
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

        {/* Formulaire coupon version desktop */}
        <CouponForm
          appliedCoupons={appliedCoupons}
          onCouponApplied={handleCouponChange}
        />

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
            <p>
              TVA Produits ({((productTVA / productTotalHT) * 100).toFixed(1)}%)
            </p>
            <p>{productTVA.toFixed(2)}€</p>
          </div>

          <div className="flex text-primary font-bold justify-between gap-6 items-center mt-2">
            <p>Total Produits TTC</p>
            <p>{productTotalTTC.toFixed(2)}€</p>
          </div>

          {/* Affichage du grand total incluant les installations */}
          {totalInstallationTTC > 0 && (
            <>
              <div className="flex text-primary justify-between gap-6 items-center mt-3">
                <p>Installation HT</p>
                <p>{totalInstallationHT.toFixed(2)}€</p>
              </div>
              <div className="flex text-primary justify-between gap-6 items-center mt-1">
                <p>
                  TVA Installation (
                  {((totalInstallationTVA / totalInstallationHT) * 100).toFixed(
                    1,
                  )}
                  %)
                </p>
                <p>{totalInstallationTVA.toFixed(2)}€</p>
              </div>
              <div className="flex text-primary font-bold justify-between gap-6 items-center mt-2">
                <p>Total Installation TTC</p>
                <p>{totalInstallationTTC.toFixed(2)}€</p>
              </div>
              <div className="my-4">
                <Separator />
              </div>
            </>
          )}

          {/* Frais de livraison */}
          {(parseFloat(cartData?.cart?.shippingTotal || '0') > 0 ||
            parseFloat(cartData?.cart?.shippingTax || '0') > 0) && (
            <>
              <div className="flex text-primary justify-between gap-6 items-center mt-2">
                <p>Livraison HT</p>
                <p>
                  {parseFloat(cartData?.cart?.shippingTotal || '0').toFixed(2)}€
                </p>
              </div>
              {parseFloat(cartData?.cart?.shippingTax || '0') > 0 && (
                <div className="flex text-primary justify-between gap-6 items-center mt-1">
                  <p>TVA Livraison</p>
                  <p>
                    {parseFloat(cartData?.cart?.shippingTax || '0').toFixed(2)}€
                  </p>
                </div>
              )}
              <div className="flex text-primary font-bold justify-between gap-6 items-center mt-1 mb-4">
                <p>Livraison TTC</p>
                <p>
                  {(
                    parseFloat(cartData?.cart?.shippingTotal || '0') +
                    parseFloat(cartData?.cart?.shippingTax || '0')
                  ).toFixed(2)}
                  €
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Affichage des réductions */}
          {appliedCoupons.length > 0 && (
            <>
              <div className="flex text-primary justify-between gap-6 items-center mt-4 mb-2">
                <p>Remise Coupons HT</p>
                <p>-{discountHT.toFixed(2)}€</p>
              </div>
              <div className="flex text-primary font-bold justify-between gap-6 items-center mb-4">
                <p>Remise Coupons TTC</p>
                <p>-{totalDiscountAmount.toFixed(1)}€</p>
              </div>
              <Separator />
            </>
          )}

          {/* Totaux */}
          <div className="flex text-primary justify-between gap-6 items-center mt-4">
            <p>Total HT</p>
            <p>
              {(
                grandTotal - parseFloat(cartData?.cart?.totalTax || '0')
              ).toFixed(2)}
              €
            </p>
          </div>
          <div className="flex text-primary justify-between gap-6 items-center mt-2">
            <p>Total TVA</p>
            <p>{parseFloat(cartData?.cart?.totalTax || '0').toFixed(2)}€</p>
          </div>
          <div className="flex text-primary font-bold justify-between gap-6 items-center mt-2">
            <p>Total TTC</p>
            <p>{grandTotal.toFixed(2)}€</p>
          </div>
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
