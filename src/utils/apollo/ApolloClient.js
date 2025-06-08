import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from "@apollo/client";

// Middleware pour ajouter le token de session WooCommerce
const sessionMiddleware = new ApolloLink((operation, forward) => {
  const sessionData = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('woo-session'))
    : null;

  if (sessionData?.token) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'woocommerce-session': `Session ${sessionData.token}`,
      },
    }));
  }

  return forward(operation);
});

// Afterware pour sauvegarder le token de session
const sessionAfterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext();
    const session = context.response?.headers?.get('woocommerce-session');

    if (session && typeof window !== 'undefined') {
      if (session === 'false') {
        localStorage.removeItem('woo-session');
      } else if (!localStorage.getItem('woo-session')) {
        localStorage.setItem(
          'woo-session',
          JSON.stringify({ token: session, createdTime: Date.now() })
        );
      }
    }

    return response;
  });
});

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: "include",
});

const client = new ApolloClient({
  link: ApolloLink.from([
    sessionMiddleware,
    sessionAfterware,
    httpLink
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only"  // Au lieu de "no-cache"
    },
    query: {
      fetchPolicy: "network-only"  // Au lieu de "no-cache"
    }
  },
});

export default client;
