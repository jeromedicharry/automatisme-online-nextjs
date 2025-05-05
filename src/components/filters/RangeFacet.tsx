import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { SimpleFacetValue } from './utils';
import { calculerPrix } from '@/utils/functions/prices';

type RangeFacetProps = {
  values: SimpleFacetValue[];
  minValue: string;
  maxValue: string;
  onChange: (minMax: string) => void;
  isProSession?: boolean; // Ajout d'une prop pour savoir si c'est une session pro
  countryCode?: string; // Ajout d'une prop pour le code pays
};

const RangeFacet = ({
  values,
  minValue,
  maxValue,
  onChange,
  isProSession = false,
  countryCode = 'FR',
}: RangeFacetProps) => {
  // Calculer les valeurs disponibles min et max depuis les facettes une seule fois
  const availableMin =
    values.length > 0 ? Math.min(...values.map((v) => parseFloat(v.name))) : 0;
  const availableMax =
    values.length > 0
      ? Math.max(...values.map((v) => parseFloat(v.name)))
      : 100;

  // État local pour le slider
  const [sliderValues, setSliderValues] = useState<[number, number]>([
    parseFloat(minValue) || availableMin,
    parseFloat(maxValue) || availableMax,
  ]);

  // État pour stocker les prix formatés (TTC)
  const [formattedPrices, setFormattedPrices] = useState<[string, string]>([
    `${sliderValues[0]}€`,
    `${sliderValues[1]}€`,
  ]);

  // Mise à jour initiale uniquement lorsque les props minValue et maxValue changent
  // depuis l'extérieur (pas lors des manipulations internes du slider)
  useEffect(() => {
    // Ne mettre à jour que si les valeurs externes ont vraiment changé et sont différentes des valeurs actuelles
    const newMin = parseFloat(minValue);
    const newMax = parseFloat(maxValue);

    if (
      (!isNaN(newMin) && newMin !== sliderValues[0]) ||
      (!isNaN(newMax) && newMax !== sliderValues[1])
    ) {
      setSliderValues([
        !isNaN(newMin) ? newMin : sliderValues[0],
        !isNaN(newMax) ? newMax : sliderValues[1],
      ]);
    }
  }, [minValue, maxValue, sliderValues]);

  // Effet pour mettre à jour les prix formatés quand les valeurs du slider changent
  useEffect(() => {
    async function updateFormattedPrices() {
      try {
        const minPrix = await calculerPrix(
          sliderValues[0],
          isProSession,
          countryCode,
        );
        const maxPrix = await calculerPrix(
          sliderValues[1],
          isProSession,
          countryCode,
        );

        setFormattedPrices([`${minPrix}€`, `${maxPrix}€`]);
      } catch (error) {
        console.error('Erreur lors du calcul des prix:', error);
        // Fallback en cas d'erreur
        setFormattedPrices([`${sliderValues[0]}€`, `${sliderValues[1]}€`]);
      }
    }

    updateFormattedPrices();
  }, [sliderValues, isProSession, countryCode]);

  // Gestionnaire pour la fin du glissement
  const handleSliderChange = (value: [number, number]) => {
    setSliderValues(value);
    onChange(`${value[0]}-${value[1]}`);
  };

  return (
    <div className="space-y-4">
      <div>
        {/* Affichage des valeurs actuelles */}
        <div className="flex justify-between text-sm text-dark-grey mb-1">
          <span>{formattedPrices[0]}</span>
          <span>{formattedPrices[1]}</span>
        </div>

        {/* ReactSlider component */}
        <div className="py-2">
          <ReactSlider
            className="h-3 flex items-center"
            thumbClassName="w-4 h-4 bg-secondary rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-light-alt"
            trackClassName="h-1 bg-primary rounded-full"
            value={sliderValues}
            min={availableMin}
            max={availableMax}
            onChange={setSliderValues}
            onAfterChange={handleSliderChange}
            // Ajout d'une étape pour le slider
            step={(availableMax - availableMin) / 100}
          />
        </div>
      </div>

      {/* {values.length > 0 && (
        <div className="text-xs text-dark-grey">
          Prix disponibles {isProSession ? 'HT' : 'TTC'}: {availableMin}€ -{' '}
          {availableMax}€
        </div>
      )} */}
    </div>
  );
};

export default RangeFacet;
