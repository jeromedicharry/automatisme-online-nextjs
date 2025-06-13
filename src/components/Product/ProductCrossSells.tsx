import { BlocFeaturedProductsProps, CardProductProps } from '@/types/blocTypes';
import BlocFeaturedProducts from '../sections/blocs/BlocFeaturedProducts';
const ProductCrossSells = ({
  crossSellProducts,
}: {
  crossSellProducts: CardProductProps[];
}) => {
  if (!crossSellProducts || crossSellProducts.length === 0) return null;

  const featuredProductsBloc: BlocFeaturedProductsProps = {
    __typename: 'AcfPageBlocsBlocFeaturedProductsLayout',
    title: 'Pour un kit optimal',
    subtitle:
      'Automatisme Online vous recommande d’acheter ces produits complémentaires',
    products: {
      nodes: crossSellProducts,
    },
    image: {
      node: {
        sourceUrl: '',
      },
    },
  };

  return <BlocFeaturedProducts bloc={featuredProductsBloc} isProductPage />;
};

export default ProductCrossSells;
