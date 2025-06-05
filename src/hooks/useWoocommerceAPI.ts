import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { CHECKOUT_MUTATION } from '@/utils/gql/GQL_MUTATIONS';
import { CartContext } from '@/stores/CartProvider';
import useAuth from './useAuth';

export default function useWoocommerceAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cart } = useContext(CartContext);
  const { user } = useAuth();

  const [checkoutMutation] = useMutation(CHECKOUT_MUTATION);
  //   const [updateOrderStatusMutation] = useMutation(UPDATE_ORDER_STATUS);

  const createOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Début création commande avec:', { cart, user });

      if (!cart || !user) {
        console.error('Panier ou utilisateur manquant:', { cart, user });
        throw new Error('Panier ou utilisateur non disponible');
      }

      const { data } = await checkoutMutation({
        variables: {
          input: {
            paymentMethod: 'bacs',
            isPaid: false
          },
        },
      });

      console.log('Réponse mutation:', data);

      if (!data?.checkout?.order) {
        console.error('Pas de commande dans la réponse:', data);
        throw new Error('Erreur lors de la création de la commande');
      }

      console.log('Réponse mutation checkout:', data);

      if (data?.checkout?.result !== 'success') {
        throw new Error('Erreur lors de la création de la commande');
      }

      const order = data.checkout.order;
      if (!order?.adyenReference) {
        throw new Error('Référence Adyen non trouvée');
      }

      const orderData = {
        order_id: order.databaseId,
        adyen_reference: order.adyenReference,
        order: {
          currency: order.currency,
          total: parseFloat(order.total),
        },
      };

      console.log('Données commande formatées:', orderData);
      return orderData;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la commande');
      return null;
    } finally {
      setLoading(false);
    }
  };

  //   const updateOrderStatus = async (orderId: number, status: string) => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       console.log('Mise à jour du statut de la commande:', { orderId, status });

  //       const { data } = await updateOrderStatusMutation({
  //         variables: {
  //           input: {
  //             orderId,
  //             status
  //           }
  //         }
  //       });

  //       console.log('Réponse mutation updateOrderStatus:', data);

  //       if (!data?.updateOrderStatus?.order) {
  //         throw new Error('Erreur lors de la mise à jour du statut de la commande');
  //       }

  //       return data.updateOrderStatus.order;
  //     } catch (err: any) {
  //       setError(err.message || 'Erreur lors de la mise à jour du statut de la commande');
  //       return null;
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return {
    createOrder,
    // updateOrderStatus,
    loading,
    error,
  };
}
