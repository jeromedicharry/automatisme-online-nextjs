import { SeoProps } from '@/types/seo';
import ProductDescription from './ProductDescription';
import ProductGalerie from './ProductGalerie';
import ProductHeader from './ProductHeader';
import ProductPrice from './ProductPrice';
import { Heart } from 'lucide-react';
import AddToCart from './AddToCart';
import { CardProductProps } from '@/types/blocTypes';
import Image from 'next/image';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';

export interface BrandStickerProps {
  name: string;
  thumbnail?: {
    sourceUrl: string;
  };
}

export interface ProductContentProps extends CardProductProps {
  onSale: boolean;
  isPro: boolean;
  hasPose: boolean;
  uri: string;
  seo: SeoProps;
  slug: string;
  description: string;
  stockQuantity: number;
  galleryImages: {
    nodes: {
      sourceUrl: string;
    }[];
  };
  brands: { nodes: BrandStickerProps[] } | { nodes: [] } | undefined;
}

const ProductContent = ({
  product,
  paymentPictos,
}: {
  product: ProductContentProps;
  paymentPictos: any;
}) => {
  // todo ajout aux favoris + mettre sur mobile ajout favioris + ajout au panier
  // todo mettre les bons pictos de paiement voir à les mettre en dur
  // todo voir à ajouter plusieurs produits à la volée
  // todo gérer les produits remplacés (à la place du prix, bouton vers le produit de remplacemnt)
  // todo gérer les produits pros (si pas pro, on n'affiche pas le prix, bouton avec lien vers le compte pour passer en pro)
  // todo gérer la réassurance : durée d'expédition dynamique selon produit ? + selon en stock ou pas

  return (
    <article className="my-12 md:my-16">
      <div className="flex flex-col md:grid md:grid-cols-2 items-start justify-between gap-5 max-md:max-w-md mx-auto">
        <div className="flex flex-col gap-5">
          <ProductGalerie galleryImages={product.galleryImages} />
          <div className="description hidden md:block">
            <ProductDescription description={product?.description} />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="titre order-2 md:order-1">
            <ProductHeader
              title={product?.name}
              brand={product?.brands?.nodes[0]}
            />
          </div>
          <section className="prix order-3 md:order-2">
            <div className="flex items-center gap-3">
              <ProductPrice
                onSale={product?.onSale}
                variant="productPage"
                price={parseFloat(product?.price || '0')}
                regularPrice={parseFloat(product?.regularPrice || '0')}
              />
              <div className="max-md:hidden flex items-stretch gap-2 w-full justify-between mb-6">
                <div
                  title="Ajouter aux favoris"
                  className="shrink-0 basis-[45px] h-[45px] w-[45px] rounded-md flex justify-center items-center border border-primary"
                >
                  <Heart />
                </div>

                <AddToCart variant="primary" product={product}></AddToCart>
              </div>
            </div>
            <p className="mt-2 md:mt-1 font-bold text-sm md:font-normal md:text-base leading-general">
              Payer en 3 versements sans frais.
            </p>
            {product?.hasPose && (
              <div className="mt-8 md:mt-6">
                <p className="mb-4 font-bold">{"Choix de l'option"}</p>
                <div className="flex w-full md:w-fit gap-4 items-stretch">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="option1"
                      className="hidden peer"
                    />
                    <span className="block relative font-bold px-5 py-3 border border-primary rounded-md peer-checked:bg-primary-light duration-300 md:min-w-[220px]">
                      <div className="absolute font-normal bg-secondary text-white text-xs leading-general px-1 py-1/2 rounded-[3px] top-0 -translate-y-1/2 right-4">
                        Recommandé
                      </div>
                      <p>Avec installation</p>
                      <div className="text-dark-grey font-normal">
                        (+550€ TTC)
                      </div>
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="option2"
                      className="hidden peer"
                    />
                    <span className="flex items-center px-5 py-3 font-bold border h-full border-primary rounded-md peer-checked:bg-primary-light duration-300 md:min-w-[220px]">
                      Sans installation
                    </span>
                  </label>
                </div>
              </div>
            )}
          </section>
          <section className="description order-4 md:hidden">
            <ProductDescription description={product?.description} />
          </section>
          <section className="reassurance order-5 md:order-3">
            Réassurance
          </section>
          <section className="videos order-6 md:order-4">Vidéos</section>
          <section className="details order-7 md:order-5">
            <p>Détails</p>
            <div className="flex mt-8 md:mt-6 gap-4 items-center justify-between">
              <span>Moyens de paiement sécurisés</span>
              <div className="flex items-center gap-2 bg-primary">
                {paymentPictos?.map((picto: any, index: number) => (
                  <Image
                    key={index}
                    src={
                      picto?.picto?.node?.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER
                    }
                    width={100}
                    height={25}
                    alt="Moyen de paiement"
                    className="max-h-[25px] w-auto"
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
};

export default ProductContent;
