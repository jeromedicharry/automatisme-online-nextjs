// Imports
import Router from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';

// State import
import { CartProvider } from '@/stores/CartProvider';
import client from '@/utils/apollo/ApolloClient';

// Types
import type { AppProps } from 'next/app';

// Styles
import '@/styles/globals.css';
import 'nprogress/nprogress.css';
import { AuthProvider } from '@/hooks/useAuth';
import { InterMediateCartProvider } from '@/stores/IntermediateCartContext';
import { FavoritesProvider } from '@/hooks/useFavorites';

// NProgress
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <InterMediateCartProvider>
              <Component {...pageProps} />
            </InterMediateCartProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
