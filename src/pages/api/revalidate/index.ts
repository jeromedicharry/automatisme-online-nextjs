// page d'accueil
import { NextApiRequest, NextApiResponse } from 'next';

// Route générique de revalidation (pour la compatibilité)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Rediriger vers la documentation
  return res.status(400).json({
    message:
      'Veuillez utiliser les routes spécifiques de revalidation: /api/revalidate/page, /api/revalidate/product, etc.',
  });
}
