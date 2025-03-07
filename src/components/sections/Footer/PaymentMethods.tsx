import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import Image from 'next/image';
import React from 'react';

const PaymentMethods = ({ themeSettings }: { themeSettings: any }) => {
  return (
    <div className="text-white">
      <p className="text-base leading-general font-bold max-sm:text-center mb-6">
        Moyens de paiement sécurisés
      </p>
      <div className="flex items-center justify-between">
        {themeSettings?.paymentPictos?.map((picto: any, index: number) => (
          <Image
            key={index}
            src={picto?.picto?.node?.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER}
            width={100}
            height={25}
            alt="Moyen de paiement"
            className="max-h-[25px] w-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
