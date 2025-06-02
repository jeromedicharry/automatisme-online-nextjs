import type { NextApiRequest, NextApiResponse } from 'next';
import type { WebhookRequest } from '../../../types/adyen';

interface ExtendedRequest extends NextApiRequest {
  body: WebhookRequest;
  headers: {
    'x-adyen-signature'?: string;
    [key: string]: string | string[] | undefined;
  };
}

export default async function handler(
  req: ExtendedRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Vérification de l'origine Adyen
    const adyenSignature = req.headers['x-adyen-signature'];

    if (!adyenSignature) {
      return res.status(401).json({ error: 'Signature Adyen manquante' });
    }

    // Validation basique du format webhook
    if (
      !req.body.notificationItems ||
      !Array.isArray(req.body.notificationItems)
    ) {
      return res.status(400).json({ error: 'Format webhook invalide' });
    }

    // Transmission directe vers WordPress
    const wpResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/api/adyen-custom-integration/v1/webhooks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Adyen-Signature': adyenSignature,
        },
        body: JSON.stringify(req.body),
      },
    );

    if (!wpResponse.ok) {
      const errorText = await wpResponse.text();
      throw new Error(`Erreur WordPress: ${wpResponse.status} - ${errorText}`);
    }

    const responseData = await wpResponse.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Erreur webhook:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erreur serveur',
    });
  }
}
