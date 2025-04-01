// pages/api/revalidate.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Vérifier la méthode
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Récupérer les paramètres
    const { path, secret } = req.body;

    // Vérifier que tous les paramètres sont fournis
    if (!path || !secret) {
      return res
        .status(400)
        .json({ message: 'Paramètres manquants: path et secret sont requis' });
    }

    // Vérifier le secret
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
    if (secret !== REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Clé de sécurité invalide' });
    }

    console.log(`Revalidation demandée pour le chemin: ${path}`);

    // Revalider le chemin spécifié
    await res.revalidate(path);

    return res.status(200).json({
      revalidated: true,
      path,
      message: `Chemin ${path} revalidé avec succès`,
    });
  } catch (err) {
    // Si une erreur se produit, renvoyer un message d'erreur
    return res.status(500).json({
      message: `Erreur lors de la revalidation`,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
