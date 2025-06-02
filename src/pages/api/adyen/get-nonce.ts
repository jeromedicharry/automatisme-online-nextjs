import type { NextApiRequest, NextApiResponse } from 'next';
import type { NonceResponse } from '../../../types/adyen';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Appel vers WordPress pour récupérer le nonce
    const wpResponse = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/api/adyen-custom-integration/v1/get-nonce`,
    );

    if (!wpResponse.ok) {
      throw new Error(
        `Erreur WordPress: ${wpResponse.status} ${wpResponse.statusText}`,
      );
    }

    const responseData: NonceResponse = await wpResponse.json();
    res.status(200).json({ data: responseData });
  } catch (error) {
    console.error('Erreur get-nonce:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erreur serveur',
    });
  }
}
