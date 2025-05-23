import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
// import AddToCart from '../Product/AddToCart';
import ProductPrice from '../Product/ProductPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import FavoriteButton from '../atoms/FavoriteButton';
import useAuth from '@/hooks/useAuth';
import Cta from '../atoms/Cta';
import AddToCart from '../Product/AddToCart';
import { CardProductProps } from '@/types/blocTypes';
import { getProductAvailability } from '@/utils/functions/deliveryTime';

export interface CardProductMeilisearchProps {
  title: string;
  slug: string;
  id: number;
  image: string;
  meta: {
    sku: string;
    regular_price: string;
    _is_pro: boolean;
    _price: string;
    // todo attendre isFeatured slug et image et mettre à jour
    _is_featured: boolean;
    _stock: number;
    _backorders: 'YES' | 'NO';
    _restocking_lead_time: number;
    _product_ref: string;
  };
  thumbnail_url: string;
}

const CardProductMeilisearch = ({
  product,
}: {
  product: CardProductMeilisearchProps;
}) => {
  const { loggedIn, isPro } = useAuth();

  // utils/productConverters.ts
  const convertMeiliToWooProduct = (
    meiliProduct: CardProductMeilisearchProps,
  ): CardProductProps => ({
    slug: meiliProduct.slug,
    databaseId: meiliProduct.id,
    id: meiliProduct.id.toString(),
    name: meiliProduct.title,
    featuredImage: {
      node: {
        sourceUrl: meiliProduct.image || meiliProduct.thumbnail_url || '',
      },
    },
    price: meiliProduct.meta?._price || '',
    regularPrice: meiliProduct.meta?.regular_price || '',
    salePrice: '', // À adapter si disponible
    sku: meiliProduct.meta?.sku || '',
    uri: `/produit/${meiliProduct.slug}`,
    isPro: meiliProduct.meta?._is_pro || false,
    featured: meiliProduct.meta?._is_featured || false,
    onSale: false, // À adapter selon besoin
    hasProDiscount: false, // À adapter
    stockQuantity: meiliProduct.meta?._stock || 0,
    backorders: meiliProduct.meta?._backorders || 'NO',
    restockingLeadTime: meiliProduct.meta?._restocking_lead_time || 0,
  });

  const { isSellable } = getProductAvailability({
    stock: product.meta._stock,
    backorders: product.meta._backorders,
    restockingLeadTime: product.meta._restocking_lead_time,
  });
  return (
    <article className="flex flex-col xxl:max-w-full h-full shadow-card px-3 py-5 rounded-[7px] md:rounded-lg duration-300 overflow-hidden group bg-white hover:shadow-cardhover text-primary maw">
      <div className="relative min-h-[239px]">
        <Link
          href={`/nos-produits/${product?.slug}`}
          className="absolute inset-0 w-full flex items-center justify-center"
        >
          <Image
            src={product?.thumbnail_url || PRODUCT_IMAGE_PLACEHOLDER}
            alt={product?.title}
            width={248}
            height={257}
            className="block h-full object-contain w-full hover:opacity-85 duration-300"
          />
        </Link>
        <div className="bg-white flex justify-between items-center relative">
          {product?.meta?._is_featured ? (
            <span className="px-[6px] rounded-[2px] h-[21px] flex items-center justify-center bg-primary-light text-xs leading-general font-bold">
              Choix AO
            </span>
          ) : (
            <span></span>
          )}
          {loggedIn && product?.id !== undefined && (
            <span>
              <FavoriteButton productId={Number(product?.id)} />
            </span>
          )}
        </div>
      </div>
      <Link href={`/nos-produits/${product?.slug}`} className="group">
        <h3 className="mt-4 mb-1 font-bold text-base leading-general duration-300 group-hover:text-secondary">
          {product?.title}
        </h3>
      </Link>

      <p className="text-dark-grey uppercase text-base leading-general mb-[10px]">
        {product?.meta?._product_ref || 'Référence produit'}
      </p>
      {/* <p className="mb-[10px]">Widget Avis vérifiés</p> */}
      {product?.meta?._is_pro && !isPro ? (
        <div className="mt-auto">
          <Cta
            variant="secondary"
            slug="/compte"
            size="default"
            isFull
            label="Passer mon compte en pro"
          >
            Passer mon compte en pro
          </Cta>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <ProductPrice
              price={parseFloat(product?.meta?._price || '0')}
              regularPrice={parseFloat(product?.meta?.regular_price || '0')}
              variant="card"
            />
          </div>
          {isSellable ? (
            <div className="mt-auto">
              <AddToCart product={convertMeiliToWooProduct(product)} />
            </div>
          ) : (
            <p className="text-secondary border border-secondary rounded-md px-3 py-3 flex items-center mt-auto">
              En rupture de stock
            </p>
          )}
        </>
      )}
    </article>
  );
};

export default CardProductMeilisearch;
