import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  label,
}) => {
  return (
    <>
      <label
        htmlFor={id}
        className="relative inline-flex items-center cursor-pointer"
      >
        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-12 h-6 bg-greyhover rounded-full peer-checked:bg-primary transition-all relative">
          <div
            className={`absolute w-4 h-4 bg-white rounded-full shadow-md top-1 left-1 transform transition-all ${
              checked ? 'translate-x-6' : ''
            }`}
          />
        </div>
      </label>
      {label && <span className="font-bold text-primary">{label}</span>}
    </>
  );
};

export default ToggleSwitch;
