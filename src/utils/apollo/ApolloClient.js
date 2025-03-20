import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Observable } from '@apollo/client/utilities';
import { GraphQLClient } from 'graphql-request';
import { gql } from '@apollo/client';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Constantes pour les clés de stockage
const AUTH_TOKEN_SS_KEY = 'auth-token';
const REFRESH_TOKEN_LS_KEY = 'refresh-token';
const WOO_SESSION_KEY = 'woo-session';

// Mutation pour rafraîchir le jeton d'authentification
const RefreshAuthTokenDocument = gql`
  mutation RefreshAuthToken($refreshToken: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
      authToken
    }
  }
`;

// Query pour obtenir le jeton de session
const GetCartDocument = gql`
  query GetCart {
    cart {
      sessionToken
    }
  }
`;

/**
 * Vérifie si les informations d'identification sont présentes
 */
export function hasCredentials() {
  if (!process.browser) return false;

  const authToken = sessionStorage.getItem(AUTH_TOKEN_SS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_LS_KEY);

  return !!authToken && !!refreshToken;
}

/**
 * Variable pour stocker l'intervalle de rafraîchissement du token
 */
let tokenSetter;

/**
 * Récupère le jeton d'authentification ou en demande un nouveau
 */
export async function getAuthToken() {
  if (!process.browser) return null;

  let authToken = sessionStorage.getItem(AUTH_TOKEN_SS_KEY);
  if (!authToken || !tokenSetter) {
    authToken = await fetchAuthToken();
  }
  return authToken;
}

/**
 * Rafraîchit le jeton d'authentification en utilisant le refresh token
 */
async function fetchAuthToken() {
  if (!process.browser) return null;

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_LS_KEY);
  if (!refreshToken) {
    // L'utilisateur n'est pas authentifié
    return null;
  }

  try {
    const graphQLClient = new GraphQLClient(
      process.env.NEXT_PUBLIC_GRAPHQL_URL,
    );

    const results = await graphQLClient.request(RefreshAuthTokenDocument, {
      refreshToken,
    });

    const authToken = results?.refreshJwtAuthToken?.authToken;
    if (!authToken) {
      throw new Error("Échec de récupération du jeton d'authentification");
    }

    // Sauvegarder le token
    sessionStorage.setItem(AUTH_TOKEN_SS_KEY, authToken);

    // Configurer le rafraîchissement automatique
    if (tokenSetter) {
      clearInterval(tokenSetter);
    }

    // Rafraîchir toutes les 12 minutes (le token expire après 15 minutes)
    tokenSetter = setInterval(
      async () => {
        if (!hasCredentials()) {
          clearInterval(tokenSetter);
          return;
        }
        fetchAuthToken();
      },
      1000 * 60 * 12, // 12 minutes
    );

    return authToken;
  } catch (err) {
    console.error('Erreur lors du rafraîchissement du token:', err);
    // En cas d'échec, supprimer les tokens invalides
    sessionStorage.removeItem(AUTH_TOKEN_SS_KEY);
    localStorage.removeItem(REFRESH_TOKEN_LS_KEY);
    return null;
  }
}

/**
 * Récupère le token de session du localStorage ou en fetch un nouveau si nécessaire
 */
async function getSessionToken(forceFetch = false) {
  if (!process.browser) return null;

  const sessionData = JSON.parse(
    localStorage.getItem(WOO_SESSION_KEY) || 'null',
  );
  let sessionToken = sessionData?.token;

  // Vérifier l'expiration si le token existe
  if (sessionToken && sessionData.createdTime && !forceFetch) {
    if (Date.now() - sessionData.createdTime > SEVEN_DAYS) {
      // Token expiré, supprimer et récupérer un nouveau
      localStorage.removeItem(WOO_SESSION_KEY);
      localStorage.setItem('woocommerce-cart', JSON.stringify({}));
      sessionToken = null; // Forcer la récupération d'un nouveau token
    }
  }

  if (!sessionToken || forceFetch) {
    sessionToken = await fetchSessionToken();

    if (sessionToken) {
      localStorage.setItem(
        WOO_SESSION_KEY,
        JSON.stringify({ token: sessionToken, createdTime: Date.now() }),
      );
    }
  }

  return sessionToken;
}

/**
 * Fetch un nouveau token de session
 */
async function fetchSessionToken() {
  const headers = {};
  const authToken = await getAuthToken();

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const graphQLClient = new GraphQLClient(
      process.env.NEXT_PUBLIC_GRAPHQL_URL,
      { headers },
    );
    const cartData = await graphQLClient.request(GetCartDocument);
    const sessionToken = cartData?.cart?.sessionToken;

    if (!sessionToken) {
      throw new Error('Échec de récupération du jeton de session');
    }

    return sessionToken;
  } catch (err) {
    console.error('Erreur lors de la récupération du jeton de session:', err);
    return null;
  }
}

/**
 * Crée le middleware pour ajouter les jetons aux requêtes
 */
function createSessionLink() {
  return setContext(async ({ context: { headers: currentHeaders } = {} }) => {
    const headers = { ...currentHeaders };
    const authToken = await getAuthToken();
    const sessionToken = await getSessionToken();

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    if (sessionToken) {
      headers['woocommerce-session'] = `Session ${sessionToken}`;
    }

    if (authToken || sessionToken) {
      return { headers };
    }

    return {};
  });
}

/**
 * Crée le link pour gérer les erreurs liées aux tokens
 */
function createErrorLink() {
  return onError(({ graphQLErrors, operation, forward }) => {
    const targetErrors = [
      'The iss do not match with this server',
      'invalid-secret-key | Expired token',
      'invalid-secret-key | Signature verification failed',
      'Expired token',
      'Wrong number of segments',
    ];

    let observable;
    if (graphQLErrors?.length) {
      graphQLErrors.forEach(({ message, debugMessage }) => {
        if (
          targetErrors.includes(message) ||
          targetErrors.includes(debugMessage)
        ) {
          observable = new Observable((observer) => {
            getSessionToken(true)
              .then((sessionToken) => {
                operation.setContext(({ headers = {} }) => {
                  const nextHeaders = { ...headers };

                  if (sessionToken) {
                    nextHeaders['woocommerce-session'] =
                      `Session ${sessionToken}`;
                  } else {
                    delete nextHeaders['woocommerce-session'];
                  }

                  return { headers: nextHeaders };
                });
              })
              .then(() => {
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              })
              .catch((error) => {
                observer.error(error);
              });
          });
        }
      });
    }

    return observable;
  });
}

/**
 * Crée l'afterware pour mettre à jour le token de session
 */
function createUpdateLink() {
  return new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      if (!process.browser) return response;

      /**
       * Check for session header and update session in local storage accordingly.
       */
      const context = operation.getContext();
      const {
        response: { headers },
      } = context;

      const session = headers.get('woocommerce-session');

      if (session) {
        if ('false' === session) {
          // Remove session data if session destroyed.
          localStorage.removeItem(WOO_SESSION_KEY);
        } else {
          const currentSessionData =
            JSON.parse(localStorage.getItem(WOO_SESSION_KEY)) || {};
          const currentToken = currentSessionData.token;

          // Mettre à jour seulement si le token est différent
          if (session !== currentToken) {
            localStorage.setItem(
              WOO_SESSION_KEY,
              JSON.stringify({
                token: session,
                createdTime: currentSessionData.createdTime || Date.now(),
              }),
            );
          }
        }
      }

      return response;
    });
  });
}

/**
 * Sauvegarde les informations d'authentification
 */
export function saveCredentials(authToken, sessionToken, refreshToken = null) {
  if (!process.browser) return;

  sessionStorage.setItem(AUTH_TOKEN_SS_KEY, authToken);

  // Mettre à jour le jeton de session
  const currentSessionData = JSON.parse(
    localStorage.getItem(WOO_SESSION_KEY) || '{}',
  );
  localStorage.setItem(
    WOO_SESSION_KEY,
    JSON.stringify({
      token: sessionToken,
      createdTime: currentSessionData.createdTime || Date.now(),
    }),
  );

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_LS_KEY, refreshToken);
  }

  // Configurer le rafraîchissement automatique
  if (tokenSetter) {
    clearInterval(tokenSetter);
  }

  tokenSetter = setInterval(
    async () => {
      if (!hasCredentials()) {
        clearInterval(tokenSetter);
        return;
      }
      fetchAuthToken();
    },
    1000 * 60 * 12, // 12 minutes
  );
}

const isServerSide = typeof window === 'undefined';

// Apollo GraphQL client.
const client = new ApolloClient({
  ssrMode: isServerSide,
  link: from([
    createSessionLink(),
    createErrorLink(),
    createUpdateLink(),
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      credentials: 'include',
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
