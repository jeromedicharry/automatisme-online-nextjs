import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
// import AddToCart from '../Product/AddToCart';
import ProductPrice from '../Product/ProductPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import FavoriteButton from '../atoms/FavoriteButton';
import useAuth from '@/hooks/useAuth';
import Cta from '../atoms/Cta';

export interface CardProductMeilisearchProps {
  title: string;
  slug: string;
  id: number;
  image: string;
  meta: {
    sku: string;
    regular_price: string;
    _is_pro: boolean;
    price: string;
    // todo attendre isFeatured slug et image et mettre à jour
    _is_featured: boolean;
  };
  thumbnail: {
    medium: {
      url: string;
    };
  };
}

const CardProductMeilisearch = ({
  product,
}: {
  product: CardProductMeilisearchProps;
}) => {
  const { loggedIn, isPro } = useAuth();
  return (
    <article className="flex flex-col max-w-[250px] xxl:max-w-full h-full shadow-card px-3 py-5 rounded-[7px] md:rounded-lg duration-300 overflow-hidden group bg-white hover:shadow-cardhover text-primary maw">
      <div className="relative min-h-[239px]">
        <Link
          href={`/nos-produits/${product?.slug}`}
          className="absolute inset-0 w-full flex items-center justify-center"
        >
          <Image
            src={product?.thumbnail?.medium?.url || PRODUCT_IMAGE_PLACEHOLDER}
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
        {product?.meta?.sku || 'Référence produit'}
      </p>
      <p className="mb-[10px]">Widget Avis vérifiés</p>
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
          <ProductPrice
            price={parseFloat(product?.meta?.price || '0')}
            regularPrice={parseFloat(product?.meta?.regular_price || '0')}
            variant="card"
          />
          <div className="mt-auto">
            {/* <AddToCart product={product} /> */}
            {/* Todo faire un addtocart dédiée pour meiliserach */}
          </div>
        </>
      )}
    </article>
  );
};

export default CardProductMeilisearch;
