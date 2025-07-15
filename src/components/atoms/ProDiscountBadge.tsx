import React from 'react';

interface ProDiscountBadgeProps {
  className?: string;
  discountRate?: number;
  isSingleProduct?: boolean;
}

const ProDiscountBadge: React.FC<ProDiscountBadgeProps> = ({
  className = '',
  discountRate = 5, // Fallback à 5% si non défini
  isSingleProduct = false,
}) => {

  return (
    <div
      className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-secondary rounded ${isSingleProduct ? 'md:text-lg' : 'md:text-base'} ${className}`}
    >
      -{discountRate}% pour les Pros
    </div>
  );
};

export default ProDiscountBadge;
