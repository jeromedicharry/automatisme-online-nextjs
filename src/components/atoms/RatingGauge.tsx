import React from 'react';

type RatingGaugeProps = {
  label: string;
  rating: number; // entre 0 et 5
};

const RatingGauge: React.FC<RatingGaugeProps> = ({ label, rating }) => {
  // Clamp la note entre 0 et 5
  const clampedRating = Math.max(0, Math.min(5, rating));
  const percentage = (clampedRating / 5) * 100;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-xs font-bold leading-general">{label}</div>
      <div className="w-[100px] h-[5px] bg-breadcrumb-grey rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-secondary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default RatingGauge;
