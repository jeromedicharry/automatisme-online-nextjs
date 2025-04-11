import { SimpleFacetValue } from './utils';

type MaxValueFacetProps = {
  values: SimpleFacetValue[];
  selectedValues: string[];
  onChange: (value: string) => void;
};

const MaxValueFacet = ({
  values,
  selectedValues,
  onChange,
}: MaxValueFacetProps) => {
  return (
    <ul className="space-y-2">
      {values
        .map(({ name }) => ({ value: parseFloat(name), name }))
        .filter((v) => !isNaN(v.value))
        .sort((a, b) => a.value - b.value)
        .map(({ value, name }) => (
          <li key={name}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="w-3 h-3 accent-primary"
                checked={selectedValues.includes(name)}
                onChange={() => onChange(name)}
              />
              <span>≤ {value}</span>
            </label>
          </li>
        ))}
    </ul>
  );
};

export default MaxValueFacet;
