import React, { useContext } from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import { CartContext } from '@/stores/CartProvider';
import Cta from '../atoms/Cta';
import Image from 'next/image';

import Separator from '../atoms/Separator';
import Link from 'next/link';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';

const CartSummary = ({
  isProSession,
  isCheckout = false,
}: {
  isProSession: boolean;
  isCheckout?: boolean;
}) => {
  const { cart } = useContext(CartContext);

  if (!cart || !cart.products) {
    return null;
  }

  return (
    <>
      <BlocIntroSmall title="Récapitulatif" />
      <div className="md:hidden p-6 bg-white rounded-lg shadow-card w-full">
        <div className="flex items-center justify-between gap-4">
          <div>
            <strong>Total panier</strong>
            <div className="text-xl">
              {isProSession ? 'HT: ' : 'TTC: '}
              {cart.totalProductsPrice.toFixed(2)}€
            </div>
          </div>
          <Cta
            slug="/caisse"
            label="Continuer"
            size="default"
            variant="primary"
            additionalClass="w-full max-w-[196px] mx-0"
          >
            Continuer
          </Cta>
        </div>
      </div>
      <div className="max-md:hidden p-4 bg-white rounded-lg shadow-card flex flex-col gap-4 items-stretch">
        {cart.products.map((product, index) => (
          <Link
            title="Voir le produit"
            href={`/nos-produits/${product.productId}`}
            className="flex justify-between items-center"
            key={index}
          >
            <Image
              src={product.image.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER}
              alt={product.name || 'Produit automatisme online'}
              width={80}
              height={80}
              className="max-w-[60px] aspect-square object-contain shrink-0"
            />
            <div className="font-bold shrink-1 overflow-hidden text-ellipsis break-words whitespace-pre-line line-clamp-2">
              {product.name}
            </div>
            <div className="font-bold">{product.totalPrice.toFixed(2)}€</div>
          </Link>
        ))}

        <Separator />
        <div>
          <div className="text-dark-grey flex justify-between gap-6 items-center">
            <p>Livraison choisie</p>
            <data>xx, xx€</data>
          </div>
        </div>
        <Separator />
        <div>
          <div className="flex text-primary font-bold justify-between gap-6 items-center">
            <p>Total {isProSession ? 'HT' : 'TTC'}</p>
            <p>{cart.totalProductsPrice.toFixed(2)}€</p>
          </div>
          <div className="flex text-primary justify-between gap-6 items-center">
            <p>
              Dont TVA (
              {(
                (cart.totalTax * 100) /
                (cart.totalProductsPrice - cart.totalTax)
              ).toFixed(1)}
              %)
            </p>
            <p>{isProSession ? '0€' : `${cart.totalTax.toFixed(2)}€`}</p>
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
      </div>
    </>
  );
};

export default CartSummary;
