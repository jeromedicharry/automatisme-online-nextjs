import React from 'react';

const BlocIntroSmall = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  if (!title && !subtitle) return null;
  return (
    <div className="border-left-wdith-[3px] border-secondary pl-2 flex flex-col gap-2">
      {title && <h2 className="text-xl font-medium">{title}</h2>}
      {subtitle && <p className="text-[0.6875rem] text-dargrey">{subtitle}</p>}
    </div>
  );
};

export default BlocIntroSmall;
