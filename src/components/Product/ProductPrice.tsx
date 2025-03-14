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
  onSale = false,
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
    <div className="flex items-center gap-4">
      <div
        className={`flex flex-col ${variant === 'productPage' ? 'items-start' : 'items-center'}`}
      >
        <p
          className={`font-bold ${variant === 'productPage' ? 'text-5xl pr-[52px]' : 'text-2xl pr-7'} leading-general relative w-fit mb-1`}
        >
          <span
            className={`absolute text-[0.5em] font-bold right-0 top-[0.25em]`}
          >
            {isPro ? 'HT' : 'TTC'}
          </span>
          <data className={`pr-1 text-[0.75em]`}>{priceWithVAT}</data>€
        </p>
        {onSale && regularPrice && price && (
          <p className="text-dark-grey line-through mb-4 text-base">
            <data>{regularPriceWithVAT}</data>
            <span>€</span>
            {/* <span>{isPro ? ' HT' : ' TTC'}</span> */}
          </p>
        )}
      </div>
      {onSale && regularPrice && price && (
        <span
          className={`bg-secondary text-white rounded-[3px] font-bold ${variant === 'productPage' ? 'text-xs px-2 py-1 mb-[26px]' : 'text-base  px-4 py-2'} leading-general`}
        >
          {Math.round(((150 - price) / regularPrice) * 100)}%
        </span>
      )}
    </div>
  );
};

export default ProductPrice;
