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
    <div className="md:mb-3">
      <button
        onClick={onToggle}
        className="md:w-full flex items-baseline text-left gap-2"
      >
        <p className="font-bold max-md:text-sm leading-general whitespace-nowrap">
          {label}
        </p>
        <div
          className={`text-secondary w-3 h-3 flex justify-center items-center duration-300 ${
            isOpen ? 'rotate-90' : '-rotate-90'
          }`}
        >
          <Chevron />
        </div>
      </button>

      <div
        className={`mt-3 overflow-hidden duration-300 ease-in-out ${
          isOpen
            ? 'max-h-[600px] static'
            : 'absolute max-h-0 pointer-events-none opacity-85'
        } transform origin-top`}
      >
        {children}
      </div>
    </div>
  );
};

export default FacetSection;
