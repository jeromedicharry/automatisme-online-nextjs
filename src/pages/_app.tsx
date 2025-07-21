// Imports
import Router from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from '@apollo/client';
import GTMProvider from '@/components/GTMProvider';

// State import
import { CartProvider } from '@/stores/CartProvider';
import DoofinderProvider from '@/stores/DoofinderProvider.jsx';
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
        <DoofinderProvider clientType="particulier">
          <FavoritesProvider>
            <CartProvider>
              <InterMediateCartProvider>
                <GTMProvider />
                <Component {...pageProps} />
              </InterMediateCartProvider>
            </CartProvider>
          </FavoritesProvider>
        </DoofinderProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
