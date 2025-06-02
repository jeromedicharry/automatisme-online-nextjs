import type { NextApiRequest, NextApiResponse } from 'next';
import { Product, RootObject } from '@/stores/CartProvider';

interface CreateOrderBody {
  cart: RootObject;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    billing?: {
      country?: string;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { cart, user } = req.body as CreateOrderBody;

    if (!cart || !cart.products || !user) {
      return res.status(400).json({ 
        message: 'Données de panier ou utilisateur manquantes' 
      });
    }

    // Préparer les données de la commande pour WooCommerce
    const orderData = {
      payment_method: 'adyen',
      payment_method_title: 'Adyen',
      customer_id: user.id,
      billing: {
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        email: user.email,
        country: user.billing?.country || 'FR'
      },
      line_items: cart.products.map((product: Product) => ({
        product_id: product.productId,
        quantity: product.qty,
        meta_data: product.addInstallation ? [
          {
            key: 'add_installation',
            value: true
          },
          {
            key: 'installation_price',
            value: product.installationPrice
          }
        ] : []
      })),
      meta_data: [
        {
          key: 'is_adyen_payment',
          value: true
        }
      ]
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/api/adyen-custom-integration/v1/create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': (req.headers['x-wp-nonce'] as string) || '',
        },
        body: JSON.stringify(orderData),
        credentials: 'include',
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Erreur lors de la création de la commande',
      );
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Erreur createOrder:', error);
    res.status(500).json({ message: error.message || 'Erreur serveur' });
  }
}
