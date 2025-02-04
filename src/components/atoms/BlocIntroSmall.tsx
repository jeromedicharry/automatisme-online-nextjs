import React from 'react';

const BlocIntroSmall = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  if (!title && !subtitle) return null;
  return (
    <div className="border-l-[3px] border-secondary pl-2 flex flex-col gap-2 mb-4 md:mb-6 text-primary">
      {title && (
        <h2 className="text-xl font-medium leading-general">{title}</h2>
      )}
      {subtitle && <p className="text-dark-grey">{subtitle}</p>}
    </div>
  );
};

export default BlocIntroSmall;
