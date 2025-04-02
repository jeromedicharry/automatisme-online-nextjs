// revalidation des pages (sauf accueil)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const secret = req.body?.secret;

    // Vérifier les paramètres
    if (!secret) {
      return res.status(400).json({ message: 'Secret manquant' });
    }

    // Vérifier le secret
    const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;
    if (secret !== REVALIDATION_SECRET) {
      return res.status(401).json({ message: 'Clé de sécurité invalide' });
    }

    // Déterminer le chemin à revalider
    let path = '/';

    // Revalider le chemin
    await res.revalidate(path);

    return res.status(200).json({
      revalidated: true,
      path,
      message: `Page ${path} revalidée avec succès`,
    });
  } catch (err) {
    console.error('Erreur de revalidation:', err);
    return res.status(500).json({
      message: `Erreur lors de la revalidation`,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
