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
import ProDiscountBadge from '../atoms/ProDiscountBadge';

export interface CardProductMeilisearchProps {
  title: string;
  slug: string;
  id: number;
  image: string;
  meta: {
    sku: string;
    _regular_price: string;
    _is_pro: boolean;
    _price: string;
    _is_featured: boolean;
    _stock: number;
    _backorders: 'YES' | 'NO';
    _restocking_lead_time: number;
    _product_ref: string;
    _replacement_id?: number;
  };
  attributes?: {
    'reduction-pro': Array<{
      slug: string;
    }>;
  };
  thumbnail_url: string;
}

const CardProductMeilisearch = ({
  product,
  discountRate,
}: {
  product: CardProductMeilisearchProps;
  discountRate?: number;
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
    regularPrice: meiliProduct.meta?._regular_price || '',
    salePrice: '', // À adapter si disponible
    sku: meiliProduct.meta?.sku || '',
    uri: `/produit/${meiliProduct.slug}`,
    isPro: meiliProduct.meta?._is_pro || false,
    acfFeatured: { isFeatured: meiliProduct.meta?._is_featured || false },
    onSale: false, // À adapter selon besoin
    hasProDiscount: meiliProduct.attributes?.['reduction-pro']?.[0]?.slug === 'oui' || false,
    stockQuantity: meiliProduct.meta?._stock || 0,
    backorders: meiliProduct.meta?._backorders || 'NO',
    restockingLeadTime: meiliProduct.meta?._restocking_lead_time || 0,
    productRef: meiliProduct.meta?._product_ref || '',
  });

  const { isSellable } = getProductAvailability({
    stock: product.meta._stock,
    backorders: product.meta._backorders,
    restockingLeadTime: product.meta._restocking_lead_time,
  });

  const isReplaced = product.meta._replacement_id !== undefined;
  const hasProDiscount = product.attributes?.['reduction-pro']?.[0]?.slug === 'oui';

  return (
    <article className="card-product-meilisearch flex flex-col xxl:max-w-full h-full shadow-card px-3 py-5 rounded-[7px] md:rounded-lg duration-300 overflow-hidden group bg-white hover:shadow-cardhover text-primary maw">
      <div className="relative min-h-[80px] md:min-h-[239px]">
        <Link
          href={`/nos-produits/${product?.slug}`}
          className="absolute inset-0 w-full flex items-center justify-center py-2 md:py-4"
        >
          <Image
            src={product?.thumbnail_url || PRODUCT_IMAGE_PLACEHOLDER}
            alt={product?.title}
            width={248}
            height={257}
            className="block h-full object-contain w-full hover:opacity-85 duration-300"
          />
          {hasProDiscount && isPro && (
            <div className="absolute bottom-2 left-2 z-10">
              <ProDiscountBadge discountRate={discountRate} />
            </div>
          )}
        </Link>
        <div className="bg-white flex justify-between items-center relative">
          {product?.meta?._is_featured && (
            <div className="flex gap-2 mb-2">
              <span className="w-fit px-[10px] rounded-[6px] h-[28px] flex items-center justify-center bg-primary-light text-base leading-general font-bold">
                Choix AO
              </span>
            </div>
          )}
          {loggedIn && product?.id !== undefined && (
            <span>
              <FavoriteButton productId={Number(product?.id)} />
            </span>
          )}
        </div>
      </div>
      <Link href={`/nos-produits/${product?.slug}`} className="group">
        <h3 className="mt-2 md:mt-4 mb-1 font-bold text-sm md:text-base leading-general duration-300 group-hover:text-secondary">
          {product?.title}
        </h3>
      </Link>

      <div className="mt-auto">
        <p className="text-dark-grey uppercase text-sm md:text-base leading-general mb-[10px]">
          {product?.meta?._product_ref || 'Référence produit'}
        </p>
        {product?.meta?._product_ref && (
          <div className="">
            <div
              className="skeepers_product__stars"
              data-product-id={product?.meta?._product_ref}
            ></div>
          </div>
        )}
        {product?.meta?._is_pro && !isPro ? (
          <div className="mt-4 md:mt-6">
            <Cta
              variant="secondary"
              slug="/compte"
              size="default"
              isFull
              label="Créer un compte pro"
            >
              Créer un compte pro
            </Cta>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <ProductPrice
                price={parseFloat(product?.meta?._price || '0')}
                regularPrice={parseFloat(product?.meta?._regular_price || '0')}
                variant="card"
                isMeili
                hasProDiscount={hasProDiscount}
                discountRate={discountRate}
              />
            </div>
            {isReplaced ? (
              <div className="mt-4 md:mt-6">
                <Cta
                  label="Voir le produit"
                  slug={`/nos-produits/${product?.slug}`}
                  isFull
                  variant="primaryHollow"
                >
                  Voir le produit
                </Cta>
              </div>
            ) : isSellable ? (
              <div className="mt-4 md:mt-6">
                <AddToCart
                  product={convertMeiliToWooProduct(product)}
                  isMeili
                />
              </div>
            ) : (
              <p className="text-secondary border border-secondary rounded-md px-3 py-3 flex items-center mt-4 md:mt-6">
                En rupture de stock
              </p>
            )}
          </>
        )}
      </div>
    </article>
  );
};

export default CardProductMeilisearch;
