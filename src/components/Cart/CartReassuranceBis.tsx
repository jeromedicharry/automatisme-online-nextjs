import React from 'react';
import { PaymentCBSvg } from './CartReassurance';
import { RetourSvg, ShippingSvg } from '../SVG/Icons';

const CartReassuranceBis = () => {
  return (
    <div className="shadow-card p-4 bg-white rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <div className="bg-primary-light px-[6px] py-[5px] rounded-[3px] min-h-[34px]">
          <div className="w-6 h-6 flex items-center">
            <ShippingSvg />
          </div>
        </div>
        <div className="font-bold underline">
          Frais de port offerts dès 350€
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-primary-light px-[6px] py-[5px] rounded-[3px] min-h-[34px]">
          <div className="w-6 h-6 flex items-center">
            <PaymentCBSvg />
          </div>
        </div>
        <div className="font-bold underline">Paiement en 3X sans frais</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-primary-light px-[6px] py-[5px] rounded-[3px] min-h-[34px]">
          <div className="w-6 h-6 flex items-center">
            <RetourSvg />
          </div>
        </div>
        <div className="font-bold underline">Retours sous 15 jours</div>
      </div>
    </div>
  );
};

export default CartReassuranceBis;
