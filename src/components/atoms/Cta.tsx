import Link from 'next/link';
import React from 'react';

const Cta = ({
  handleButtonClick,
  children,
  label,
  slug,
  size = 'default',
  variant = 'primary',
  isFull,
  additionalClass,
  disabled = false,
  isMeili = false,
  target = '_self',
}: {
  children?: React.ReactNode;
  handleButtonClick?: (e: React.MouseEvent) => void;
  label: string;
  slug: string;
  size?: 'default' | 'large' | 'small' | 'mobile-header';
  variant?:
    | 'primary'
    | 'secondary'
    | 'primaryHollow'
    | 'secondaryHollow'
    | 'primaryWhite';
  isFull?: boolean;
  additionalClass?: string;
  disabled?: boolean;
  isMeili?: boolean;
  target?: string;
}) => {
  const buttonClass = `
  ${size !== 'mobile-header' ? 'whitespace-nowrap' : 'whitespace-normal'}
  flex items-center justify-center font-bold transition duration-300 ease-in-out rounded-[5px] lg:min-w-[170px] border
`;

  const isMeiliClass = isMeili ? 'max-md:text-sm' : '';

  const sizeClass =
    size === 'large'
      ? 'text-base leading-general px-12 py-3 gap-4 whitespace-nowrap'
      : size === 'small'
        ? 'text-xs leading-general px-2 py-1 gap-[2px] min-h-[24px] min-w-fit'
        : size === 'mobile-header'
          ? 'text-clamp leading-general px-[0.75em] py-3 gap-[2px] min-h-[24px] w-full truncate '
          : 'text-base leading-general px-4 py-2 gap-2 min-h-[43px]';

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-primary-dark border-primary hover:border-primary-dark',
    primaryHollow:
      'border border-primary  bg-primary text-white lg:text-primary lg:bg-transparent hover:bg-primary hover:text-white',
    secondary:
      'bg-secondary text-white hover:bg-secondary-dark border-secondary hover:border-secondary-dark',
    secondaryHollow:
      'border border-secondary bg-secondary text-white lg:text-secondary lg:bg-transparent hover:bg-secondary hover:text-white',

    primaryWhite:
      'bg-white text-primary border border-white hover:bg-greyhover',
  };

  return (
    <Link
      href={slug}
      title={label}
      className={`${buttonClass} ${isMeiliClass} ${sizeClass} ${variantClasses[variant]} ${additionalClass} ${isFull ? 'w-full' : 'w-fit mx-auto'}`}
      onClick={handleButtonClick}
      aria-disabled={disabled}
      target={target}
    >
      {children}
    </Link>
  );
};

export default Cta;
