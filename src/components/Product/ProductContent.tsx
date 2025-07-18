import { SeoProps } from '@/types/seo';
import ProductDescription from './ProductDescription';
import ProductGalerie from './ProductGalerie';
import ProductHeader from './ProductHeader';
import ProductPrice from './ProductPrice';
import AddToCart from './AddToCart';
import { CardProductProps } from '@/types/blocTypes';
import ProductDetails from './ProductDetails';
import FavoriteButton from '../atoms/FavoriteButton';
import useAuth from '@/hooks/useAuth';
import Cta from '../atoms/Cta';
import {
  PaymentApplePaySvg,
  PaymentCBSvg,
  PaymentGooglePaySvg,
  PaymentPaypalSvg,
} from '../Cart/CartReassurance';
import ProductReassurance from './ProductReassurance';
import { getProductAvailability } from '@/utils/functions/deliveryTime';
import { useState } from 'react';
import AddInstallation from '@/AddInstallation';

export interface BrandStickerProps {
  name: string;
  thumbnailUrl: string;
}

export interface ProductFaqItemProps {
  title: string;
  content: string;
}

export interface ProductDocsProps {
  productNotice: {
    node: {
      mediaItemUrl: string;
    };
  };
  noticeTech: {
    node: {
      mediaItemUrl: string;
    };
  };
}

export interface ProductContentProps extends CardProductProps {
  onSale: boolean;
  productRef: string;
  ecoTaxValue?: number;
  isPro: boolean;
  hasPose: boolean;
  isKit: boolean;
  uri: string;
  installationPrice: number;
  seo: SeoProps;
  slug: string;
  replacementUrl?: string;
  description: string;
  backorders: 'YES' | 'NO';
  restockingLeadTime: number;
  stockQuantity: number;
  acfProductDocs: ProductDocsProps;
  acfProduct: {
    faq: ProductFaqItemProps[];
  };
  acfFeatured: {
    isFeatured: boolean;
  };
  galleryImages: {
    nodes: {
      sourceUrl: string;
    }[];
  };
  productBrands: { nodes: BrandStickerProps[] };
  upsell: {
    nodes: CardProductProps[];
  };
  crossSell: {
    nodes: CardProductProps[];
  };
}

const ProductContent = ({
  product,
  proDiscountRate = 5,
}: {
  product: ProductContentProps;
  proDiscountRate?: number;
}) => {
  const { loggedIn, isPro } = useAuth();
  const [addInstallation, setAddInstallation] = useState(true);
  const NotProConnectedAlternate = () => {
    if (!loggedIn) {
      return (
        <div className="flex flex-col gap-3 justify-start items-start">
          <p>{'Ce produit est réservé aux professionnels.'}</p>
          <div className="w-fit">
            <Cta
              variant="secondary"
              slug="/compte"
              size="default"
              label="Me connecter ou créer un compte pro"
            >
              Me connecter ou créer un compte pro
            </Cta>
          </div>
        </div>
      );
    }
    if (!isPro) {
      return (
        <div className="flex flex-col gap-3 justify-start align-top">
          <p>{'Ce produit est réservé aux professionnels.'}</p>
          <div className="w-fit">
            <Cta
              variant="secondary"
              slug="/compte"
              size="default"
              label="Passer mon compte en pro"
            >
              Passer mon compte en pro
            </Cta>{' '}
          </div>
        </div>
      );
    }

    return null;
  };

  // todo gérer les produits remplacés (à la place du prix, bouton vers le produit de remplacemnt)

  const { deliveryLabel, isSellable } = getProductAvailability({
    stock: product.stockQuantity,
    backorders: product.backorders,
    restockingLeadTime: product.restockingLeadTime,
  });

  return (
    <article className="mb-12 mt-2 md:mt-16 md:mb-16">
      <div className="flex flex-col lg:flex-row xl:grid xl:grid-cols-2 items-center lg:items-start lg:justify-between gap-5 max-lg:max-w-xxl mx-auto">
        <div className="flex flex-col gap-5 w-full lg:max-w-[500px] xl:max-w-full">
          <ProductGalerie
            galleryImages={product.galleryImages}
            hasProDiscount={product?.hasProDiscount}
            discountRate={proDiscountRate}
          />
          <div className="description hidden md:block">
            <ProductDescription description={product?.description} />
          </div>
        </div>
        <div className="flex flex-col gap-5 shrink-1 lg:sticky lg:top-48">
          <div className="titre order-2 md:order-1">
            {product?.acfFeatured?.isFeatured && (
              <span className="w-fit px-[10px] mb-1 rounded-[6px] h-[28px] flex items-center justify-center bg-primary-light text-base leading-general font-bold">
                Choix AO
              </span>
            )}
            <ProductHeader
              title={product?.name}
              brand={product?.productBrands?.nodes[0]}
              productRef={product?.productRef}

            />
          </div>
          <section className="prix order-3 md:order-2">
            {product?.isPro && !isPro ? (
              <NotProConnectedAlternate />
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start lg:items-start lg:flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
                  <ProductPrice
                    onSale={product?.onSale}
                    variant="productPage"
                    price={parseFloat(product?.price || '0')}
                    regularPrice={parseFloat(product?.regularPrice || '0')}
                    hasProDiscount={product?.hasProDiscount}
                    discountRate={proDiscountRate}
                  />
                  <div className="md:hidden max-md: mb-4">
                    <AddInstallation
                      installationPrice={product?.installationPrice || 0}
                      addInstallation={addInstallation}
                      setAddInstallation={setAddInstallation}
                    />
                  </div>
                  <div className="flex items-stretch gap-3 justify-between mb-6 w-fit">
                    {loggedIn && product?.databaseId !== undefined && (
                      <div className="shrink-0 basis-[45px] h-[45px] w-[45px] rounded-md flex justify-center items-center border border-primary">
                        <FavoriteButton
                          productId={Number(product?.databaseId)}
                        />
                      </div>
                    )}

                    {product?.replacementUrl ? (
                      <Cta
                        variant="secondary"
                        slug={product?.replacementUrl}
                        size="default"
                        label="Produit de remplacement"
                      >
                        Voir le produit de remplacement
                      </Cta>
                    ) : isSellable ? (
                      <AddToCart
                        variant="primary"
                        product={product}
                        addInstallation={
                          product?.hasPose ? addInstallation : false
                        }
                        isSingleProduct
                      ></AddToCart>
                    ) : (
                      <p className="text-secondary border border-secondary rounded-md px-3 py-2 flex items-center">
                        Produit en rupture de stock
                      </p>
                    )}
                  </div>
                </div>
                {isSellable &&
                product.ecoTaxValue &&
                product.ecoTaxValue > 0 ? (
                  <em className="text-sm text-dark-grey leading-general mb-3 block mt-[-8px]">
                    Eco-Taxe incluse : {product.ecoTaxValue} €
                  </em>
                ) : null}
                <p className="mt-2 md:mt-1 font-bold text-sm md:font-normal md:text-base leading-general">
                  Payer en 3 versements sans frais.
                </p>
              </>
            )}
            {product?.hasPose && product?.installationPrice && (
              <div className="max-md:hidden mt-8 md:mt-6">
                <AddInstallation
                  installationPrice={product.installationPrice}
                  addInstallation={addInstallation}
                  setAddInstallation={setAddInstallation}
                />
              </div>
            )}
          </section>
          <section className="description order-4 md:hidden">
            <ProductDescription description={product?.description} />
          </section>
          {/* <section className="videos order-6 md:order-4">Vidéos</section> */}
          <section className="details order-7 md:order-5">
            <ProductReassurance deliveryLabel={deliveryLabel} />
            <ProductDetails
              faqItems={product?.acfProduct?.faq}
              productDocs={product.acfProductDocs}
            />
            <div
              className="skeepers_product__reviews"
              data-product-id={product?.productRef}
              data-locale="fr_FR"
              data-price={product?.price}
              data-currency="EUR"
              data-name={product?.name}
              data-url={process.env.NEXT_PUBLIC_WEBSITE_URL + product?.uri}
              data-image-url={product?.featuredImage?.node?.sourceUrl}
            ></div>
            <div className="flex mt-8 md:mt-6 gap-4 items-center justify-between">
              <span className="max-sm:text-xs leading-general shrink-1">
                Moyens de paiement sécurisés
              </span>
              <div className="flex gap-4 items-center text-primary">
                <PaymentCBSvg /> <PaymentPaypalSvg /> <PaymentApplePaySvg />
                <PaymentGooglePaySvg />
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
};

export default ProductContent;
