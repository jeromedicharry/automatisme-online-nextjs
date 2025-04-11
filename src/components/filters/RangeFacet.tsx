import { SimpleFacetValue } from './utils';

type RangeFacetProps = {
  values: SimpleFacetValue[];
  minValue: string;
  maxValue: string;
  onChange: (minMax: string) => void;
};

const RangeFacet = ({
  values,
  minValue,
  maxValue,
  onChange,
}: RangeFacetProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fourchette de prix
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Min"
            className="w-full p-2 border rounded"
            value={minValue}
            onChange={(e) => onChange(`${e.target.value}-${maxValue}`)}
          />
          <span>à</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full p-2 border rounded"
            value={maxValue}
            onChange={(e) => onChange(`${minValue}-${e.target.value}`)}
          />
        </div>
      </div>
      {values.length > 0 && (
        <div className="text-xs text-gray-500">
          Valeurs disponibles:{' '}
          {Math.min(...values.map((v) => parseFloat(v.name)))}€ -
          {Math.max(...values.map((v) => parseFloat(v.name)))}€
        </div>
      )}
    </div>
  );
};

export default RangeFacet;
