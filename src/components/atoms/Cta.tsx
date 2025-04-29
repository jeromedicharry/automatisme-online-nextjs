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
}: {
  children?: React.ReactNode;
  handleButtonClick?: (e: React.MouseEvent) => void;
  label: string;
  slug: string;
  size?: 'default' | 'large' | 'small';
  variant?:
    | 'primary'
    | 'secondary'
    | 'primaryHollow'
    | 'secondaryHollow'
    | 'primaryWhite';
  isFull?: boolean;
  additionalClass?: string;
  disabled?: boolean;
}) => {
  const buttonClass =
    'whitespace-nowrap flex items-center justify-center font-bold transition duration-300 ease-in-out rounded-[5px] lg:min-w-[170px] border';
  const sizeClass =
    size === 'large'
      ? 'text-base leading-general px-12 py-3 gap-4 whitespace-nowrap'
      : size === 'small'
        ? 'text-xs leading-general px-2 py-1 gap-[2px] min-h-[24px] min-w-fit'
        : 'text-base leading-general px-4 py-2 gap-2 min-h-[43px]';

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-primary-dark border-primary hover:border-primary-dark',
    primaryHollow:
      'border border-primary text-primary hover:bg-primary hover:text-white',
    secondary:
      'bg-secondary text-white hover:bg-secondary-dark border-secondary hover:border-secondary-dark',
    secondaryHollow:
      'border border-secondary text-secondary hover:bg-secondary hover:text-white',
    primaryWhite:
      'bg-white text-primary border border-white hover:bg-greyhover',
  };

  return (
    <Link
      href={slug}
      title={label}
      className={`${buttonClass} ${sizeClass} ${variantClasses[variant]} ${additionalClass} ${isFull ? 'w-full' : 'w-fit mx-auto'}`}
      onClick={handleButtonClick}
      aria-disabled={disabled}
    >
      {children}
    </Link>
  );
};

export default Cta;
