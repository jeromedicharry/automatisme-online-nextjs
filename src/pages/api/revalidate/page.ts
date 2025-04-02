import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Vérifier que la méthode est POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    console.log('DEBUT DU REVALIDATE DEPUIS WP');

    // Récupérer les données du corps de la requête
    const { slug, secret } = req.body;

    console.log('Données reçues:', {
      slug,
      secret: secret ? '******' : 'manquant',
    });

    // Vérifier le secret
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
    if (!secret) {
      return res.status(400).json({ message: 'Secret manquant' });
    }

    if (secret !== REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Clé de sécurité invalide' });
    }

    // Vérifier le slug
    if (slug === undefined) {
      return res.status(400).json({ message: 'Slug manquant pour la page' });
    }

    // Déterminer le chemin à revalider
    let path = '/';
    if (slug && slug !== 'accueil' && slug !== 'home') {
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
