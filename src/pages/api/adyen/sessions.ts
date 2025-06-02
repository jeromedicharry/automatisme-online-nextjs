import type { NextApiRequest, NextApiResponse } from 'next';

interface ExtendedRequest extends NextApiRequest {
  body: {
    amount: {
      currency: string;
      value: number;
    };
    reference: string;
    returnUrl: string;
  };
}

const getWpNonce = async (): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/api/adyen-custom-integration/v1/get-nonce`,
  );
  const { nonce } = await response.json();
  return nonce;
};

export default async function handler(
  req: ExtendedRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, reference, returnUrl } = req.body;

    // Validation des paramètres
    if (!amount?.currency || !amount?.value || !reference || !returnUrl) {
      return res.status(400).json({
        error: 'Paramètres manquants: amount (currency et value), reference, returnUrl requis',
      });
    }

    // Validation du montant
    if (typeof amount.value !== 'number' || amount.value <= 0) {
      return res.status(400).json({
        error: 'Le montant doit être un nombre positif en centimes',
      });
    }

    const requestData = {
      amount: {
        currency: amount.currency.toUpperCase(),
        value: amount.value
      },
      reference,
      returnUrl,
      shopperLocale: 'fr-FR',
      countryCode: 'FR',
    };

    // Appel vers votre backend WordPress
    const wpResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/api/adyen-custom-integration/v1/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce':
            (req.headers['x-wp-nonce'] as string) || (await getWpNonce()),
        },
        body: JSON.stringify(requestData),
      },
    );

    if (!wpResponse.ok) {
      const errorText = await wpResponse.text();
      throw new Error(`Erreur WordPress: ${wpResponse.status} - ${errorText}`);
    }

    const responseData = await wpResponse.json();
    res.status(200).json({ data: responseData.data });
  } catch (error) {
    console.error('Erreur sessions:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erreur serveur',
    });
  }
}
