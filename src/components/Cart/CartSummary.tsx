import React, { useContext, useEffect } from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import { CartContext } from '@/stores/CartProvider';
import Cta from '../atoms/Cta';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { getFormattedCart } from '@/utils/functions/functions';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import Separator from '../atoms/Separator';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

const CartSummary = () => {
  const { cart, setCart } = useContext(CartContext);
  const { countryCode, user } = useAuth();

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: async () => {
      const updatedCart = await getFormattedCart(data, user, countryCode);
      if (!updatedCart || !updatedCart.products.length) {
        localStorage.removeItem('woocommerce-cart');
        setCart(null);
        return;
      }
      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      console.log({ cart });
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <>
      <BlocIntroSmall title="Récapitulatif" />
      <div className="md:hidden p-6 bg-white rounded-lg shadow-card w-full">
        <div className="flex items-center justify-between gap-4">
          <div>
            <strong>Total panier</strong>
            <div className="text-xl">
              {cart?.taxInfo?.isPriceHT ? 'HT: ' : 'TTC: '}
              {cart?.totalProductsPrice?.toFixed(2)}€
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
        {cart?.products?.map((product: any, index: number) => (
          <Link
            title="Voir le produit"
            href={`/nos-produits/${product?.product?.node?.slug}`}
            className="flex justify-between items-center"
            key={index}
          >
            <Image
              src={product?.image?.sourceUrl}
              alt={product?.name || 'Produit automatisme online'}
              width={80}
              height={80}
              className="max-w-[60px] aspect-square object-contain shrink-0"
            />
            <div className="font-bold shrink-1">{product?.name}</div>
            <div className="text-xl">
              {cart?.taxInfo?.isPriceHT ? '' : ''}
              {product?.totalPrice?.toFixed(2)}€
            </div>
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
            <p>Total {cart?.taxInfo?.isPriceHT ? 'HT' : 'TTC'}</p>
            <p>{cart?.totalProductsPrice?.toFixed(2)}€</p>
          </div>
          <div className="flex text-primary justify-between gap-6 items-center">
            <p>Dont TVA</p>
            <p
              dangerouslySetInnerHTML={{
                __html: data?.cart?.totalTax,
              }}
            />
          </div>
        </div>
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
      </div>
    </>
  );
};

export default CartSummary;
