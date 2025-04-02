import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Accepter les méthodes POST et GET pour plus de flexibilité
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    console.log('DEBUT DU REVALIDATE DEPUIS WP');

    // Récupérer les données du corps de la requête OU des paramètres de l'URL
    const secret = req.body?.secret || req.query?.secret;
    const slug = req.body?.slug || req.query?.slug;

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
      return res
        .status(401)
        .json({ message: 'Clé de sécurité invalide', provided: secret });
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
