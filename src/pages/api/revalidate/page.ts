// revalidation des pages (sauf accueil)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    console.log('DEBUT DU REVALIDATE DEPUIS WP');
    const { slug, secret } = req.body;

    // Vérifier les paramètres
    if (!secret) {
      return res.status(400).json({ message: 'Secret manquant' });
    }
    // Vérifier les paramètres
    if (!slug) {
      return res.status(400).json({ message: 'Slug manquant pour la page' });
    }

    // Vérifier le secret
    const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;
    if (secret !== REVALIDATION_SECRET) {
      return res.status(401).json({ message: 'Clé de sécurité invalide' });
    }

    // Déterminer le chemin à revalider
    let path = '/';
    if (slug && slug !== 'accueil') {
      path = `/${slug}`;
    }

    console.log(`Revalidation de page: ${path}`);

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
