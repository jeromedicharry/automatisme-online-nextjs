import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { APPLY_COUPON, REMOVE_COUPON } from '@/utils/gql/GQL_MUTATIONS';

interface CouponFormProps {
  appliedCoupons?: Array<{
    code: string;
    discountAmount: string;
    discountTax: string;
  }>;
  onCouponApplied?: () => void;
}

const CouponForm = ({
  appliedCoupons = [],
  onCouponApplied,
}: CouponFormProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [applyCoupon] = useMutation(APPLY_COUPON);
  const [removeCoupon] = useMutation(REMOVE_COUPON);
  console.log('appliedCoupons:', appliedCoupons);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const { data } = await applyCoupon({
        variables: {
          code: couponCode.trim(),
        },
      });

      if (data?.applyCoupon?.cart) {
        setCouponCode('');
        onCouponApplied?.();
      } else {
        setError('Code promo invalide ou expiré');
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'application du code promo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = async (code: string) => {
    try {
      await removeCoupon({
        variables: {
          code,
        },
      });
      onCouponApplied?.();
    } catch (err) {
      console.error('Erreur lors de la suppression du coupon:', err);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="font-bold text-sm mb-3">Code promo</h3>

      {/* Formulaire d'ajout de coupon */}
      <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-3">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Entrez votre code promo"
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !couponCode.trim()}
          className="px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Application...' : 'Appliquer'}
        </button>
      </form>

      {/* Affichage des erreurs */}
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

      {/* Liste des coupons appliqués */}
      {appliedCoupons.length > 0 && (
        <div className="space-y-2">
          {appliedCoupons.map((coupon, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-primary-light-alt border border-primary-light rounded px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-primary font-medium text-sm">
                  {coupon.code}
                </span>
                <span className="text-primary text-sm">
                  (-
                  {(
                    parseFloat(coupon.discountAmount) +
                    parseFloat(coupon.discountTax)
                  ).toFixed(1)}
                  € TTC)
                </span>
              </div>
              <button
                onClick={() => handleRemoveCoupon(coupon.code)}
                className="text-primary hover:text-secondary duration-300"
                title="Supprimer le code promo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponForm;
