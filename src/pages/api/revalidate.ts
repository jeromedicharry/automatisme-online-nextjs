// pages/api/revalidate.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Accepter à la fois GET et POST
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Récupérer les paramètres (de GET ou POST)
    const token =
      req.method === 'POST' ? req.body.secret : (req.query.token as string);

    // Déterminer le chemin à revalider
    let path = '/'; // Par défaut, revalider l'accueil

    // Vérifier le secret
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
    if (!token || token !== REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Clé de sécurité invalide' });
    }

    // Déterminer le chemin de revalidation en fonction des paramètres
    if (req.method === 'GET') {
      if (req.url?.includes('/api/revalidate/product')) {
        const slug = req.query.slug as string;
        if (slug) {
          path = `/product/${slug}`;
        } else {
          // Revalider toutes les pages produits (ou la page d'index des produits)
          path = '/products';
        }
      } else if (req.url?.includes('/api/revalidate/page')) {
        const slug = req.query.slug as string;
        if (slug) {
          path = `/${slug}`;
        }
      }
    } else if (req.method === 'POST') {
      // Si un chemin est explicitement fourni dans le POST
      if (req.body.path) {
        path = req.body.path;
      }
    }

    // Revalider le chemin spécifié
    await res.revalidate(path);

    return res.status(200).json({
      revalidated: true,
      path,
      message: `Chemin ${path} revalidé avec succès`,
    });
  } catch (err) {
    console.error('Erreur de revalidation:', err);
    // Si une erreur se produit, renvoyer un message d'erreur
    return res.status(500).json({
      message: `Erreur lors de la revalidation`,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
