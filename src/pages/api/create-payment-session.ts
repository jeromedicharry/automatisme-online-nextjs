// pages/api/create-payment-session.ts

import { createWooCommerceOrder } from '@/utils/functions/create-order';
import { initializeAdyenSession } from '@/utils/functions/initialize-adyen-session';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Valider les données reçues
    const { billing, shipping, line_items } = req.body;

    if (!billing || !line_items || !Array.isArray(line_items)) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    // 2. Créer la commande WooCommerce
    const orderData = {
      payment_method: 'adyen',
      billing,
      shipping,
      line_items,
    };

    const order = await createWooCommerceOrder(orderData);

    // 3. Initialiser la session de paiement Adyen
    const sessionData = await initializeAdyenSession(order);

    // 4. Retourner les données de session
    return res.status(200).json(sessionData);
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating payment session',
      error: error.message,
    });
  }
}
