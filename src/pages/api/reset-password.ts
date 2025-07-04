import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Méthode non autorisée' });

  const { key, login, password } = req.body;

  if (!key || !login || !password) {
    return res.status(400).json({ message: 'Données manquantes' });
  }

  try {
    // GraphQL pour réinitialiser le mot de passe
    const graphqlEndpoint = `${process.env.NEXT_PUBLIC_ADMIN_URL}/graphql`;

    const graphqlQuery = {
      query: `
        mutation ResetPassword($input: ResetPasswordInput!) {
          resetPassword(input: $input) {
            success
            message
          }
        }
      `,
      variables: {
        input: {
          key,
          login,
          password,
        },
      },
    };

    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si vous utilisez une authentification pour l'API GraphQL:
        // 'Authorization': `Bearer ${process.env.GRAPHQL_AUTH_TOKEN}`
      },
      body: JSON.stringify(graphqlQuery),
    });

    // Vérifier si la réponse est JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Réponse non-JSON reçue:', await response.text());
      return res.status(500).json({
        message:
          'Le serveur WordPress a retourné une réponse invalide (non-JSON)',
        status: response.status,
        statusText: response.statusText,
      });
    }

    const data = await response.json();

    // Vérifier les erreurs GraphQL
    if (data.errors) {
      console.error('Erreurs GraphQL:', data.errors);
      return res.status(400).json({
        message:
          data.errors[0]?.message || 'Erreur lors de la réinitialisation',
        errors: data.errors,
      });
    }

    // Vérifier le résultat de la mutation
    const resetResult = data?.data?.resetPassword;

    if (!resetResult?.success) {
      return res.status(400).json({
        message:
          resetResult?.message ||
          'Échec de la réinitialisation du mot de passe',
      });
    }

    return res.status(200).json({
      message: resetResult.message || 'Mot de passe réinitialisé avec succès',
    });
  } catch (error: any) {
    console.error('Erreur dans /api/reset-password:', error);
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
    });
  }
}
