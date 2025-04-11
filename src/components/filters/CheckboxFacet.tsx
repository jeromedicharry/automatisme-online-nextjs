import { SimpleFacetValue } from './utils';

type CheckboxFacetProps = {
  values: SimpleFacetValue[];
  selectedValues: string[];
  onChange: (value: string) => void;
};

const CheckboxFacet = ({
  values,
  selectedValues,
  onChange,
}: CheckboxFacetProps) => {
  return (
    <ul className="space-y-2 overflow-y-auto max-h-[600px] scrollbar-custom pr-6">
      {values.map(({ name, count }) => (
        <li key={name}>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="w-3 h-3 accent-primary"
              checked={selectedValues.includes(name)}
              onChange={() => onChange(name)}
            />
            <span className="whitespace-nowrap">
              {name} ({count})
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default CheckboxFacet;
