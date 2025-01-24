import { useState } from 'react';

export interface TermProps {
  name: string;
  slug: string;
  productsCount: number;
}
export interface TaxonomyFilterProps {
  name: string;
  terms: TermProps[];
}
const TaxonomyFilter = ({ name, terms }: TaxonomyFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <p
        className="text-lg font-bold flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {name}{' '}
        <span className={`duration-300 ${isOpen ? '' : 'rotate-180'}`}>
          <ArrowFilter />
        </span>
      </p>
      {terms.map((term) => (
        <div key={term.slug}>
          <input type="checkbox" id={term.slug} />
          <label htmlFor={term.slug}>{term.name}</label>
        </div>
      ))}
    </div>
  );
};

export default TaxonomyFilter;

export const ArrowFilter = () => (
  <svg
    width="6"
    height="5"
    viewBox="0 0 6 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.244977 2.8124L2.0334 0.998815C2.36055 0.667061 2.88399 0.667061 3.21115 0.998815L5.00502 2.8124C5.52846 3.34321 5.15769 4.25 4.41615 4.25L0.833848 4.25C0.0923061 4.25 -0.278465 3.34321 0.244977 2.8124Z"
      fill="#E94E1B"
    />
  </svg>
);
