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
  isMeili?: boolean;
  hasProDiscount?: boolean;
  discountRate?: number;
}

// attention aux types string number sur les prices Todo

const ProductPrice = ({
  price,
  regularPrice,
  variant = 'card',
  isMeili = false,
  hasProDiscount = false,
  discountRate = 0,
}: ProductPriceProps) => {
  const [priceWithVAT, setPriceWithVAT] = useState<number>(price);
  const [regularPriceWithVAT, setRegularPriceWithVAT] =
    useState<number>(regularPrice);

  const { user, countryCode, loading } = useAuth();

  useEffect(() => {
    async function displayFormattedPrices(
      price: number,
      regularPrice: number,
      countryCode: string,
      isProSession: boolean | undefined,
    ) {
      try {
        const calculatedPrice = await calculerPrix(
          price,
          isProSession,
          countryCode,
          hasProDiscount,
          discountRate,
        );
        const calculatedRegularPrice = await calculerPrix(
          regularPrice,
          isProSession,
          countryCode,
          hasProDiscount,
          discountRate,
        );
        setPriceWithVAT(calculatedPrice);
        setRegularPriceWithVAT(calculatedRegularPrice);
      } catch (error) {
        console.error('Error calculating VAT:', error);
      }
    }

    // Si le chargement est terminé, on peut calculer les prix
    if (!loading) {
      const isProSession = isProRole(user?.roles?.nodes);

      displayFormattedPrices(
        price,
        regularPrice,
        countryCode || 'FR',
        isProSession,
      );
    }
  }, [
    loading,
    user,
    price,
    regularPrice,
    countryCode,
    hasProDiscount,
    discountRate,
  ]);

  return (
    <div
      className={`flex items-center gap-2 xxl:gap-4 ${isMeili ? 'max-md:gap-1' : ''}`}
    >
      <div
        className={`flex flex-col ${variant === 'productPage' ? 'items-start' : 'items-center'}`}
      >
        <p
          className={`font-bold ${variant === 'productPage' ? 'text-5xl xl:text-4xl xxl:text-5xl pr-[50px] lg:pr-[54px] xl:pr-[42px] xxl:pr-[50px]' : isMeili ? 'max-md:text-xl max-md:pr-6 text-2xl pr-7' : 'text-2xl pr-7'} leading-general relative w-fit mb-1`}
        >
          <span
            className={`absolute text-[0.5em] font-bold right-0 top-[0.25em] xl:-top-[0.25em] xxl:top-[0.25em]`}
          >
            {!loading && isProRole(user?.roles?.nodes) ? 'HT' : 'TTC'}
          </span>
          <data className={`pr-1 text-[0.85em]`}>
            {priceWithVAT.toFixed(2)}
          </data>
          €
        </p>
        {regularPrice !== price ? (
          <p
            className={`text-dark-grey line-through mb-4 text-base ${isMeili ? 'max-md:text-sm' : ''}`}
          >
            <data>{regularPriceWithVAT.toFixed(2)}</data>
            <span>€</span>
            <span className="text-sm align-top leading-relaxed">
              {!loading && isProRole(user?.roles?.nodes) ? ' HT' : ' TTC'}
            </span>
          </p>
        ) : null}
      </div>
      {regularPrice !== price ? (
        <span
          className={`bg-secondary text-white rounded-[3px] shrink-0 font-bold text-xs px-2 py-1 mb-6 ${isMeili ? 'max-sm:text-xs max-sm:px-1' : ''} ${variant === 'productPage' ? 'max-md:text-base max-md:px-4 max-md:py-2 max-md:mb-[26px]' : ''} leading-general`}
        >
          - {Math.round(((regularPrice - price) / regularPrice) * 100)}%
        </span>
      ) : null}
    </div>
  );
};

export default ProductPrice;
