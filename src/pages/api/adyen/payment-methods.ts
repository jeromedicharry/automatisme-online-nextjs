import type { NextApiRequest, NextApiResponse } from 'next';

interface PaymentMethodsBody {
  amount: number; // Montant déjà en centimes
  currency: string;
  countryCode: string;
}

const getWpNonce = async (): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/api/adyen-custom-integration/v1/get-nonce`,
  );

  if (!response.ok) {
    throw new Error(`Erreur récupération nonce: ${response.status}`);
  }

  const { nonce } = await response.json();
  return nonce;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, currency, countryCode } = req.body as PaymentMethodsBody;

    // Validation des paramètres requis
    if (typeof amount !== 'number' || !currency || !countryCode) {
      return res.status(400).json({
        error:
          'Paramètres manquants ou invalides: amount (number en centimes), currency, countryCode requis',
      });
    }

    // Validation du montant (déjà en centimes)
    if (amount <= 0 || !Number.isInteger(amount)) {
      return res.status(400).json({
        error: 'Le montant doit être un entier positif (en centimes)',
      });
    }

    // Récupération du nonce WordPress
    const wpNonce = await getWpNonce();

    // Appel POST vers votre backend WordPress
    const wpResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/api/adyen-custom-integration/v1/payment-methods`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': wpNonce,
        },

        body: JSON.stringify({
          amount: { currency: currency.toUpperCase(), value: amount },

          countryCode: countryCode.toUpperCase(), // Normalisation du code pays
        }),
      },
    );

    if (!wpResponse.ok) {
      const errorText = await wpResponse.text();
      throw new Error(
        `Erreur WordPress: ${wpResponse.status} ${wpResponse.statusText} - ${errorText}`,
      );
    }

    const responseData = await wpResponse.json();

    // Vérification de la structure de la réponse
    if (responseData.data) {
      res.status(200).json({
        data: responseData.data,
        debug: {
          amountInCents: amount,
          amountInEuros: amount / 100,
          currency,
          countryCode,
        },
      });
    } else {
      res.status(200).json({
        data: responseData,
        debug: {
          amountInCents: amount,
          amountInEuros: amount / 100,
          currency,
          countryCode,
        },
      });
    }
  } catch (error) {
    console.error('Erreur payment-methods:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erreur serveur',
    });
  }
}
