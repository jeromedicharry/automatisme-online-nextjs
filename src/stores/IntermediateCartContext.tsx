// gère le panier intermédiaire quand on ajoute un produit au panier (potentiellement depuis n'importe quelle page ou page de catégorie ou page produit)
import { CardProductProps } from '@/types/blocTypes';
import client from '@/utils/apollo/ApolloClient';
import { GET_INSTALLATION_CTA } from '@/utils/gql/WEBSITE_QUERIES';
import { GET_RELATED_PRODUCT_SIDE_DATA } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import React, { createContext, useContext, useState, useCallback } from 'react';

export interface installationData {
  title: string;
  image: {
    node: {
      sourceUrl: string;
    };
  };
  ctaLabel: string;
  ctaSlug: string;
}

interface IntermediateCartContextType {
  isCartModalOpen: boolean;
  currentAddedProduct: any | null;
  openCartModal: (product: any) => void;
  closeCartModal: () => void;
  relatedProducts: CardProductProps[];
  isKit: boolean;
  installationData?: installationData | null;
}

const IntermediateCartContext = createContext<
  IntermediateCartContextType | undefined
>(undefined);

export const InterMediateCartProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [currentAddedProduct, setCurrentAddedProduct] =
    useState<CardProductProps | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<CardProductProps[]>(
    [],
  );
  const [isKit, setIsKit] = useState(false);
  const [installationData, setInstallationData] = useState(null);

  const openCartModal = useCallback(async (product: CardProductProps) => {
    setCurrentAddedProduct(product);
    const sideData = await client.query({
      query: GET_RELATED_PRODUCT_SIDE_DATA,
      variables: {
        id: product.databaseId,
      },
    });
    const related = sideData?.data?.product?.upsell?.nodes || [];
    const isKit = sideData?.data?.product?.isKit || false;
    if (isKit) {
      const installationDataRes = await client.query({
        query: GET_INSTALLATION_CTA,
      });

      setInstallationData(
        installationDataRes?.data?.themeSettings?.optionsFields
          ?.installationCtaCard,
      );
    } else {
      setInstallationData(null);
    }
    setRelatedProducts(related);
    setIsKit(isKit);
    setIsCartModalOpen(true);
  }, []);

  const closeCartModal = useCallback(() => {
    setIsCartModalOpen(false);
    setCurrentAddedProduct(null);
    setRelatedProducts([]);
    setIsKit(false);
  }, []);

  return (
    <IntermediateCartContext.Provider
      value={{
        isCartModalOpen,
        currentAddedProduct,
        openCartModal,
        closeCartModal,
        relatedProducts,
        isKit,
        installationData,
      }}
    >
      {children}
    </IntermediateCartContext.Provider>
  );
};

export const useIntermediateCart = () => {
  const context = useContext(IntermediateCartContext);
  if (context === undefined) {
    throw new Error('useINtermediateCart must be used within a CartProvider');
  }
  return context;
};
