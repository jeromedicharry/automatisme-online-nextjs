import { Chevron } from '../SVG/Icons';

interface SliderButtonProps {
  type: 'next' | 'prev';
  size?: 'default' | 'small';
  variant: 'primary' | 'secondary' | 'white';
  classSelector: string;
  ariaLabel?: string;
}
const SliderPrevNextButton = ({
  type,
  size = 'default',
  variant,
  classSelector,
  ariaLabel = 'Voir les éléments suivants',
}: SliderButtonProps) => {
  const sizeClass = size === 'small' ? 'w-6 h-6' : 'w-[42px] h-[42px]';
  const variantClass =
    variant === 'white'
      ? 'bg-white text-primary hover:bg-greyhover'
      : variant === 'secondary'
        ? 'bg-secondary text-white hover:bg-secondary-dark'
        : 'bg-primary text-white hover:bg-primary-dark';

  return (
    <button
      className={`prev-next-button rounded-full flex ${sizeClass} items-center justify-center duration-300 ${variantClass} ${classSelector}`}
      aria-label={`${ariaLabel}`}
    >
      <div className={type === 'next' ? 'rotate-180' : ''}>
        <Chevron />
      </div>
    </button>
  );
};

export default SliderPrevNextButton;
