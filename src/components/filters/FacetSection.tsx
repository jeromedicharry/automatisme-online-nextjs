import { ReactNode } from 'react';
import { Chevron } from '../SVG/Icons';

type FacetSectionProps = {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
};

const FacetSection = ({
  label,
  isOpen,
  onToggle,
  children,
}: FacetSectionProps) => {
  return (
    <div className={`mb-3 xl:mb-4 ${label === 'Prix' ? 'lg:order-first' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-baseline text-left gap-2"
      >
        <p className="font-bold max-md:text-sm leading-general whitespace-nowrap">
          {label}
        </p>
        <div
          className={`text-secondary w-3 h-3 flex justify-center items-baseline duration-300 ${
            isOpen ? 'rotate-90' : '-rotate-90'
          }`}
        >
          <Chevron />
        </div>
      </button>

      <div
        className={`mt-2 overflow-hidden duration-300 ease-in-out ${
          isOpen
            ? 'max-h-[600px] opacity-100'
            : 'max-h-0 pointer-events-none opacity-0'
        } transform origin-top`}
      >
        {children}
      </div>
    </div>
  );
};

export default FacetSection;
