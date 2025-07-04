// pages/api/revalidate/product.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Accepter uniquement les requêtes GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Récupérer les paramètres
    const token = req.query.token as string;
    const slug = req.query.slug as string;

    // Vérifier le token
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
    if (!token || token !== REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Clé de sécurité invalide' });
    }

    // Déterminer les chemins à revalider
    const paths = [];

    // Ajouter le chemin du produit spécifique s'il est fourni
    if (slug) {
      paths.push(`/nos-produits/${slug}`);
    }

    // Revalider tous les chemins nécessaires
    for (const path of paths) {
      await res.revalidate(path);
    }

    return res.status(200).json({
      revalidated: true,
      paths,
      message: `Produit(s) revalidé(s) avec succès`,
    });
  } catch (err) {
    console.error('Erreur de revalidation de produit:', err);
    return res.status(500).json({
      message: `Erreur lors de la revalidation du produit`,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
