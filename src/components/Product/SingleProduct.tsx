// Imports

// Utils
import { paddedPrice } from '@/utils/functions/functions';

// Components
import AddToCart from './AddToCart';
import { CardProductProps } from '@/types/blocTypes';
import Image from 'next/image';

interface SingleproductProps extends CardProductProps {
  description: string;
  image: {
    sourceUrl: string;
  };
}

const SingleProduct = ({ product }: { product: SingleproductProps }) => {
  let DESCRIPTION_WITHOUT_HTML;

  let { description, image, name, onSale, price, regularPrice, salePrice } =
    product;

  // Add padding/empty character after currency symbol here
  if (price) {
    price = paddedPrice(price, 'kr');
  }
  if (regularPrice) {
    regularPrice = paddedPrice(regularPrice, 'kr');
  }
  if (salePrice) {
    salePrice = paddedPrice(salePrice, 'kr');
  }

  // Strip out HTML from description
  if (process.browser) {
    DESCRIPTION_WITHOUT_HTML = new DOMParser().parseFromString(
      description,
      'text/html',
    ).body.textContent;
  }

  return (
    <section className="bg-white mb-[8rem] md:mb-12">
      {/* Show loading spinner while loading, and hide content while loading */}

      <div className="container flex flex-wrap items-center pt-4 pb-12 mx-auto">
        <div className="grid grid-cols-1 gap-4 md:mt-16 lg:grid-cols-2 xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-2">
          <Image
            id="product-image"
            src={image?.sourceUrl || '/images/logo-automatisme-online.png'}
            width={500}
            height={500}
            alt={name}
            className="h-auto p-8 transition duration-500 ease-in-out transform xl:p-2 md:p-2 lg:p-2 md:hover:grow md:hover:scale-105"
          />

          <div className="px-4 md:ml-8">
            <h1 className="text-2xl font-bold text-center md:text-left mb-4">
              {name}
            </h1>
            {/* Display sale price when on sale */}
            {onSale && (
              <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                <p className="text-2xl font-bold text-gray-900">{salePrice}</p>
                <p className="text-xl text-gray-500 line-through md:ml-4">
                  {regularPrice}
                </p>
              </div>
            )}
            {/* Display regular price when not on sale */}
            {!onSale && <p className="text-2xl font-bold mb-4">{price}</p>}
            <p className="text-lg mb-4 text-center md:text-left">
              {DESCRIPTION_WITHOUT_HTML}
            </p>

            <div className="w-full p-4 md:p-0">
              <AddToCart product={product} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
