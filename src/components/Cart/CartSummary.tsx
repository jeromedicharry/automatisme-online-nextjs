import React, { useContext, useEffect } from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import { CartContext } from '@/stores/CartProvider';
import Cta from '../atoms/Cta';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { getFormattedCart } from '@/utils/functions/functions';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import Separator from '../atoms/Separator';

const CartSummary = () => {
  const { setCart } = useContext(CartContext);

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const updatedCart = getFormattedCart(data);
      if (!updatedCart && !data.cart.contents.nodes.length) {
        localStorage.removeItem('woocommerce-cart');
        setCart(null);
        return;
      }
      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
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
            <div
              className="text-xl"
              dangerouslySetInnerHTML={{
                __html: data?.cart?.total,
              }}
            />
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
        {data?.cart?.contents?.nodes?.map((product: any, index: number) => (
          <div className="flex justify-between items-center" key={index}>
            <Image
              src={product?.product?.node?.image?.sourceUrl}
              alt={product?.name}
              width={80}
              height={80}
              className="max-w-[60px] aspect-square object-contain shrink-0"
            />
            <div className="font-bold shrink-1">{product?.name}</div>
            <div
              className="text-xl"
              dangerouslySetInnerHTML={{ __html: product?.total }}
            />
          </div>
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
            <p>Total TTC</p>
            <p
              dangerouslySetInnerHTML={{
                __html: data?.cart?.total,
              }}
            />
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
