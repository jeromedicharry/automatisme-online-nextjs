import React, { useState, useEffect, useRef } from 'react';
import ReactSlider from 'react-slider';
import { SimpleFacetValue } from './utils';

type MinValueFacetProps = {
  values: SimpleFacetValue[];
  selectedValues: string[];
  onChange: (value: string) => void;
};

const MinValueFacet = ({
  values,
  selectedValues,
  onChange,
}: MinValueFacetProps) => {
  // Calculer et mémoriser les valeurs min et max disponibles
  const availableRangeRef = useRef({
    min: values.length > 0
      ? Math.min(...values.map((v) => parseFloat(v.name)))
      : 0,
    max: values.length > 0
      ? Math.max(...values.map((v) => parseFloat(v.name)))
      : 100,
  });

  console.log('[MinValueFacet] Facet values:', values);
  console.log('[MinValueFacet] Min/Max range:', availableRangeRef.current);

  const { min: availableMin, max: availableMax } = availableRangeRef.current;

  // Initialiser la valeur du slider avec la valeur sélectionnée ou la valeur min disponible
  const [sliderValue, setSliderValue] = useState<number>(
    selectedValues.length > 0
      ? parseFloat(selectedValues[0])
      : availableMin
  );

  // Mettre à jour le slider quand les valeurs sélectionnées changent
  useEffect(() => {
    console.log('[MinValueFacet] Selected values changed:', selectedValues);
    if (selectedValues.length > 0) {
      const newValue = parseFloat(selectedValues[0]);
      console.log('[MinValueFacet] New value from selection:', newValue);
      if (!isNaN(newValue)) {
        setSliderValue(newValue);
      }
    } else {
      console.log('[MinValueFacet] No selection, using min:', availableMin);
      setSliderValue(availableMin);
    }
  }, [selectedValues, availableMin]);

  // Gérer le changement de valeur du slider
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  // Gérer la fin du changement (quand l'utilisateur relâche le curseur)
  const handleAfterChange = (value: number) => {
    console.log('[MinValueFacet] Slider value changed to:', value);
    onChange(value.toFixed(2));
  };

  // Calculer la position de la valeur courante en pourcentage
  const valuePosition = ((sliderValue - availableMin) / (availableMax - availableMin)) * 100;

  // Déterminer le style de positionnement de la valeur courante
  const getValueStyle = () => {
    if (valuePosition <= 10) {
      // Si le curseur est très à gauche, aligner la valeur à gauche
      return { left: '0%', transform: 'translateX(0)' };
    } else if (valuePosition >= 90) {
      // Si le curseur est très à droite, aligner la valeur à droite
      return { right: '0%', transform: 'translateX(0)' };
    }
    // Position normale au centre du curseur
    return { left: `${valuePosition}%`, transform: 'translateX(-50%)' };
  };

  return (
    <div className="space-y-4 min-w-[150px]">
      {/* Valeur courante affichée au-dessus du curseur */}
      <div className="relative h-6 overflow-visible">
        <div className="absolute top-0" style={getValueStyle()}>
          <div className="bg-white text-xs px-2 py-1 rounded shadow-sm border whitespace-nowrap">
            ≥ {sliderValue.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Slider */}
      <ReactSlider
        className="h-3 flex items-center"
        thumbClassName="w-4 h-4 bg-secondary rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-light-alt"
        trackClassName="h-1 bg-primary rounded-full"
        value={sliderValue}
        min={availableMin}
        max={availableMax}
        onChange={handleSliderChange}
        onAfterChange={handleAfterChange}
        step={(availableMax - availableMin) / 100}
      />

      {/* Plage totale disponible */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Min: {availableMin.toFixed(1)}</span>
        <span>Max: {availableMax.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default MinValueFacet;
