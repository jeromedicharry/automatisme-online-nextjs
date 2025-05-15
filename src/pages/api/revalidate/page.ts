// pages/api/revalidate/page.ts
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

    // Déterminer le chemin à revalider
    let path = slug ? `/${slug}` : '/';

    console.log(`Revalidation de page demandée pour le chemin: ${path}`);

    // Revalider le chemin
    await res.revalidate(path);

    return res.status(200).json({
      revalidated: true,
      path,
      message: `Page ${path} revalidée avec succès`,
    });
  } catch (err) {
    console.error('Erreur de revalidation de page:', err);
    return res.status(500).json({
      message: `Erreur lors de la revalidation de la page`,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
