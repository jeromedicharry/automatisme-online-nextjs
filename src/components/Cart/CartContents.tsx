import { useContext, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

import { CartContext } from '@/stores/CartProvider';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.component';
import Cta from '../atoms/Cta';

import {
  getFormattedCart,
  getUpdatedItems,
  handleQuantityChange,
  IProductRootObject,
} from '@/utils/functions/functions';

import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import { UPDATE_CART } from '@/utils/gql/GQL_MUTATIONS';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

const CartContents = () => {
  const { setCart } = useContext(CartContext);

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const updatedCart = getFormattedCart(data);
      console.log({ updateCart });
      if (!updatedCart && !data.cart.contents.nodes.length) {
        localStorage.removeItem('woocommerce-cart');
        setCart(null);
        return;
      }
      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    },
  });

  const [updateCart, { loading: updateCartProcessing }] = useMutation(
    UPDATE_CART,
    {
      onCompleted: () => {
        refetch();
        setTimeout(() => {
          refetch();
        }, 3000);
      },
    },
  );

  const handleRemoveProductClick = (
    cartKey: string,
    products: IProductRootObject[],
  ) => {
    if (products?.length) {
      const updatedItems = getUpdatedItems(products, 0, cartKey);
      updateCart({
        variables: {
          input: {
            clientMutationId: uuidv4(),
            items: updatedItems,
          },
        },
      });
    }
    refetch();
    setTimeout(() => {
      refetch();
    }, 3000);
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  // const getUnitPrice = (subtotal: string, quantity: number) => {
  //   const numericSubtotal = parseFloat(subtotal.replace(/[^0-9.-]+/g, ''));
  //   return isNaN(numericSubtotal)
  //     ? 'N/A'
  //     : (numericSubtotal / quantity).toFixed(2);
  // };

  return (
    <>
      <section>
        <BlocIntroSmall title="Détails de votre panier" />

        <div className="flex flex-col gap-6">
          {data?.cart?.contents?.nodes?.map((item: IProductRootObject) => (
            <div
              key={item.key}
              className="flex items-start justify-between p-4 bg-white rounded-lg shadow-card hover:shadow-cardhover mb-4 duration-300"
            >
              <div className="flex-shrink-0 flex w-[136px] relative justify-center items-center self-center">
                <Image
                  src={
                    item.product?.node.image?.sourceUrl || '/placeholder.png'
                  }
                  alt={item.product.node.name}
                  width={200}
                  height={200}
                  className="aspect-square object-contain"
                />
              </div>
              <div className="flex-grow ml-4">
                <h2 className="font-bold text-primary">
                  {item.product.node.name}
                </h2>
                <p>Avis vérifiés</p>
                <p
                  className="text-primary text-2xl font-bold"
                  dangerouslySetInnerHTML={{
                    __html: item.total,
                  }}
                >
                  {/* kr {getUnitPrice(item.subtotal, item.quantity)} */}
                </p>
                <div className="text-dark-grey text-xs">
                  Expédition sous 10 jours
                </div>
              </div>
              <div className="flex items-shrink">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => {
                    handleQuantityChange(
                      event,
                      item.key,
                      data.cart.contents.nodes,
                      updateCart,
                      updateCartProcessing,
                    );
                  }}
                  className="w-12 px-2 py-1 text-center border border-primary rounded-lg mr-2"
                />
                <Cta
                  slug="#"
                  label="Supprimer"
                  handleButtonClick={() =>
                    handleRemoveProductClick(item.key, data.cart.contents.nodes)
                  }
                  variant="secondaryHollow"
                  size="default"
                  additionalClass={`max-w-fit min-w-0 ${
                    updateCartProcessing ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  Supprimer
                </Cta>
              </div>
            </div>
          ))}
        </div>
      </section>

      {updateCartProcessing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg mb-2">Mise à jour du panier ...</p>
            <LoadingSpinner />
          </div>
        </div>
      )}
    </>
  );
};

export default CartContents;
