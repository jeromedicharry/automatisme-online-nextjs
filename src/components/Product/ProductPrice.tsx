// import useAuth from '@/hooks/useAuth';
// import { calculerPrix } from '@/utils/functions/prices';
import React, { useState } from 'react';

interface ProductPriceProps {
  onSale?: boolean;
  price: string;
  regularPrice: string;
  variant: 'card' | 'productPage';
  isProSession?: boolean;
  isProProduct?: boolean;
}

const ProductPrice = ({
  onSale = false,
  price,
  regularPrice,
  variant = 'card',
  isProSession = false,
  // isProProduct = false,
}: ProductPriceProps) => {
  const [priceWithVAT] = useState(price);
  const [regularPriceWithVAT] = useState(regularPrice);

  // Todo gérer la logique du calcul des prixs en fonction du user (isPro et sa TVA)

  // const user = useAuth();

  // useEffect(() => {
  //   async function calculateVAT() {
  //     try {
  //       const calculatedPrice = await calculerPrix(price, false, 'FR');
  //       const calculatedRegularPrice = await calculerPrix(
  //         regularPrice,
  //         false,
  //         'FR',
  //       );
  //       setPriceWithVAT(calculatedPrice);
  //       setRegularPriceWithVAT(calculatedRegularPrice);
  //     } catch (error) {
  //       console.error('Error calculating VAT:', error);
  //     }
  //   }
  // }, [user]);
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
            {isProSession ? 'HT' : 'TTC'}
          </span>
          <data className={`pr-1 text-[0.75em]`}>{priceWithVAT}</data>€
        </p>
        <p className="text-dark-grey line-through mb-4 text-base">
          <data>{regularPriceWithVAT}</data>
          <span>€</span>
          <span>{isProSession ? 'HT' : 'TTC'}</span>
        </p>
      </div>
      {onSale && regularPrice && price && (
        <span
          className={`bg-secondary text-white rounded-[3px] font-bold ${variant === 'productPage' ? 'text-xs px-2 py-1 mb-[26px]' : 'text-base  px-4 py-2'} leading-general`}
        >
          -
          {Math.round(
            ((parseFloat(regularPrice) - parseFloat(price)) /
              parseFloat(regularPrice)) *
              100,
          )}
          %
        </span>
      )}
    </div>
  );
};

export default ProductPrice;
