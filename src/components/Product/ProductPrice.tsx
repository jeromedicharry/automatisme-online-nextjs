// import useAuth from '@/hooks/useAuth';
// import { calculerPrix } from '@/utils/functions/prices';
import useAuth from '@/hooks/useAuth';
import { isProRole } from '@/utils/functions/functions';
import { calculerPrix } from '@/utils/functions/prices';
import React, { useEffect, useState } from 'react';

interface ProductPriceProps {
  onSale?: boolean;
  price: number;
  regularPrice: number;
  variant: 'card' | 'productPage';
  isProSession?: boolean;
  isProProduct?: boolean;
}

// attention aux types string number sur les prices Todo

const ProductPrice = ({
  price,
  regularPrice,
  variant = 'card',
  // isProProduct = false,
}: ProductPriceProps) => {
  const [priceWithVAT, setPriceWithVAT] = useState<number>(price);
  const [regularPriceWithVAT, setRegularPriceWithVAT] =
    useState<number>(regularPrice);

  const { user, countryCode } = useAuth();
  const isPro = isProRole(user?.roles?.nodes);

  useEffect(() => {
    async function displayFormattedPrices(
      price: number,
      regularPrice: number,
      countryCode: string,
    ) {
      try {
        const calculatedPrice = await calculerPrix(price, isPro, countryCode);
        const calculatedRegularPrice = await calculerPrix(
          regularPrice,
          isPro,
          countryCode,
        );
        setPriceWithVAT(calculatedPrice);
        setRegularPriceWithVAT(calculatedRegularPrice);
      } catch (error) {
        console.error('Error calculating VAT:', error);
      }
    }
    displayFormattedPrices(price, regularPrice, countryCode || 'FR');
  }, [isPro, price, regularPrice, countryCode]);

  return (
    <div className="flex items-center gap-2 xxl:gap-4">
      <div
        className={`flex flex-col ${variant === 'productPage' ? 'items-start' : 'items-center'}`}
      >
        <p
          className={`font-bold ${variant === 'productPage' ? 'text-5xl xl:text-4xl xxl:text-5xl pr-[42px] xl:pr-[35px] xxl:pr-[42px]' : 'text-2xl pr-7'} leading-general relative w-fit mb-1`}
        >
          <span
            className={`absolute text-[0.5em] font-bold right-0 top-[0.25em] xl:top-0 xxl:top-[0.25em]`}
          >
            {isPro ? 'HT' : 'TTC'}
          </span>
          <data className={`pr-1 text-[0.85em]`}>
            {priceWithVAT.toFixed(2)}
          </data>
          €
        </p>
        {regularPrice !== price ? (
          <p className="text-dark-grey line-through mb-4 text-base">
            <data>{regularPriceWithVAT.toFixed(2)}</data>
            <span>€</span>
            <span className="text-sm align-top leading-relaxed">
              {isPro ? ' HT' : ' TTC'}
            </span>
          </p>
        ) : null}
      </div>
      {regularPrice !== price ? (
        <span
          className={`bg-secondary text-white rounded-[3px] shrink-0 font-bold text-xs px-2 py-1 mb-6 ${variant === 'productPage' ? 'max-md:text-base max-md:px-4 max-md:py-2 max-md:mb-[26px]' : ''} leading-general`}
        >
          - {Math.round(((regularPrice - price) / regularPrice) * 100)}%
        </span>
      ) : null}
    </div>
  );
};

export default ProductPrice;
