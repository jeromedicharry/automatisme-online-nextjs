import { CardProductProps } from '@/types/blocTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import AddToCart from '../Product/AddToCart';
import ProductPrice from '../Product/ProductPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import FavoriteButton from '../atoms/FavoriteButton';
import useAuth from '@/hooks/useAuth';
import Cta from '../atoms/Cta';
import { getProductAvailability } from '@/utils/functions/deliveryTime';
import ProDiscountBadge from '../atoms/ProDiscountBadge';

const CardProduct = ({
  product,
  discountRate,
}: {
  product: CardProductProps;
  discountRate?: number;
}) => {
  const { loggedIn, isPro } = useAuth();
  const { isSellable } = getProductAvailability({
    stock: product.stockQuantity,
    backorders: product.backorders,
    restockingLeadTime: product.restockingLeadTime,
  });
  return (
    <article className="flex flex-col xxl:w-[325px] xxl:max-w-full h-full shadow-card px-3 py-5 rounded-[7px] md:rounded-lg duration-300 overflow-hidden group bg-white hover:shadow-cardhover text-primary maw">
      <div className="relative min-h-[239px]">
        <Link
          href={`/nos-produits/${product?.slug}`}
          className="absolute inset-0 w-full flex items-center justify-center py-2 md:py-4"
        >
          <Image
            src={
              product?.featuredImage?.node?.sourceUrl ||
              PRODUCT_IMAGE_PLACEHOLDER
            }
            alt={product?.name}
            width={248}
            height={257}
            className="block h-full object-contain w-full hover:opacity-85 duration-300"
          />
          {product?.hasProDiscount && isPro && (
            <div className="absolute bottom-2 left-2 z-10">
              <ProDiscountBadge discountRate={discountRate} />
            </div>
          )}
        </Link>
        <div className="bg-white flex justify-between items-center relative">
          {product?.acfFeatured?.isFeatured && (
            <div className="flex gap-2 mb-2">
              <span className="w-fit px-[10px] rounded-[6px] h-[28px] flex items-center justify-center bg-primary-light text-base leading-general font-bold">
                Choix AO
              </span>
            </div>
          )}
          {loggedIn && product?.databaseId !== undefined && (
            <span>
              <FavoriteButton productId={Number(product?.databaseId)} />
            </span>
          )}
        </div>
      </div>
      <Link href={`/nos-produits/${product?.slug}`} className="group">
        <h3 className="mt-4 mb-1 font-bold text-base leading-general duration-300 group-hover:text-secondary">
          {product?.name}
        </h3>
      </Link>

      <div className="mt-auto">
        <p className="text-dark-grey uppercase text-base leading-general mb-[10px]">
          {product?.sku}
        </p>
        {product?.productRef && (
          <div className="">
            <div
              className="skeepers_product__stars"
              data-product-id={product?.productRef}
            ></div>
          </div>
        )}
        {product?.isPro && !isPro ? (
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
            <ProductPrice
              price={parseFloat(product?.price || '0')}
              regularPrice={parseFloat(product?.regularPrice || '0')}
              variant="card"
              hasProDiscount={product?.hasProDiscount}
              discountRate={discountRate}
            />
            {isSellable ? (
              <div className="mt-4 md:mt-6">
                <AddToCart product={product} />
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

export default CardProduct;
