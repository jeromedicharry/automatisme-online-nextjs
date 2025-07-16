import React, { useState } from 'react';
import Cta from '@/components/atoms/Cta';
import { Chevron } from '@/components/SVG/Icons';

interface EditableFieldProps {
  label: string;
  value: string;
  onSubmit: (newValue: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onSubmit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  };

  const handleSubmit = () => {
    if (newValue !== value) {
      onSubmit(newValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewValue(value); // Réinitialise la valeur au contenu d'origine
    setIsEditing(false); // Ferme le mode édition
  };

  return (
    <div className="mb-4 border-b border-breadcrumb-grey pb-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-base leading-general mb-2">{label}</p>
          <p className="text-dark-grey text-base leading-general">{value}</p>
        </div>
        <div className="w-fit">
          <button
            onClick={handleEditToggle}
            className="font-bold text-base leading-general flex gap-1 items-baseline"
          >
            {'Modifier'}
            <div
              className={`flex items-center justify-center w-3 h-3 text-secondary duration-300 rotate-180 ${isEditing ? 'rotate-90' : ''}`}
            >
              <Chevron />
            </div>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`mt-2 flex items-center justify-between gap-4 transition-all transform duration-300 ease-out ${isEditing ? 'max-h-[300px]' : 'opacity-0 pointer-events-none max-h-0'}`}
      >
        <input
          type="text"
          value={newValue}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <div className="flex items-center gap-4">
          <Cta handleButtonClick={handleSubmit} slug="#" label="Confirmer">
            Confirmer la mise à jour
          </Cta>
          <Cta
            handleButtonClick={handleCancel}
            variant="primaryHollow"
            slug="#"
            label="Annuler"
          >
            Annuler
          </Cta>
        </div>
      </form>
    </div>
  );
};

export default EditableField;
