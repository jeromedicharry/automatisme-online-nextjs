import React, { useState, useEffect, useRef } from 'react';
import ReactSlider from 'react-slider';
import { SimpleFacetValue } from './utils';
import { calculerPrix } from '@/utils/functions/prices';
import useAuth from '@/hooks/useAuth';

type RangeFacetProps = {
  values: SimpleFacetValue[];
  minValue: string | undefined;
  maxValue: string | undefined;
  onChange: (minMax: string) => void;
};

const RangeFacet = ({
  values,
  minValue,
  maxValue,
  onChange,
}: RangeFacetProps) => {
  const availableRangeRef = useRef({
    min:
      values.length > 0
        ? Math.min(...values.map((v) => parseFloat(v.name)))
        : 0,
    max:
      values.length > 0
        ? Math.max(...values.map((v) => parseFloat(v.name)))
        : 100,
  });

  const { min: availableMin, max: availableMax } = availableRangeRef.current;
  const { isPro, countryCode } = useAuth();

  const [sliderValues, setSliderValues] = useState<[number, number]>([
    minValue ? parseFloat(minValue) : availableMin,
    maxValue ? parseFloat(maxValue) : availableMax,
  ]);

  const [formattedPrices, setFormattedPrices] = useState<[string, string]>([
    `${Math.round(sliderValues[0])}€`,
    `${Math.round(sliderValues[1])}€`,
  ]);

  const [formattedMinMaxPrices, setFormattedMinMaxPrices] = useState<
    [string, string]
  >([`${Math.round(availableMin)}€`, `${Math.round(availableMax)}€`]);

  useEffect(() => {
    const newMin = minValue ? parseFloat(minValue) : undefined;
    const newMax = maxValue ? parseFloat(maxValue) : undefined;

    if (
      newMin === undefined ||
      isNaN(newMin) ||
      newMax === undefined ||
      isNaN(newMax)
    ) {
      setSliderValues([availableMin, availableMax]);
    } else {
      setSliderValues([newMin, newMax]);
    }
  }, [minValue, maxValue, availableMin, availableMax]);

  useEffect(() => {
    async function updateFormattedPrices() {
      try {
        const minPrix = await calculerPrix(
          sliderValues[0],
          isPro,
          countryCode || 'FR',
        );
        const maxPrix = await calculerPrix(
          sliderValues[1],
          isPro,
          countryCode || 'FR',
        );

        setFormattedPrices([
          `${Math.round(minPrix)}€`,
          `${Math.round(maxPrix)}€`,
        ]);
      } catch (error) {
        console.error('Erreur lors du calcul des prix:', error);
        setFormattedPrices([
          `${Math.round(sliderValues[0])}€`,
          `${Math.round(sliderValues[1])}€`,
        ]);
      }
    }

    updateFormattedPrices();
  }, [sliderValues, isPro, countryCode]);

  useEffect(() => {
    async function updateMinMaxPrices() {
      try {
        const formattedMin = await calculerPrix(
          availableMin,
          isPro,
          countryCode || 'FR',
        );
        const formattedMax = await calculerPrix(
          availableMax,
          isPro,
          countryCode || 'FR',
        );

        setFormattedMinMaxPrices([
          `${Math.round(formattedMin)}€`,
          `${Math.round(formattedMax)}€`,
        ]);
      } catch (error) {
        console.error('Erreur lors du calcul des prix min/max:', error);
        setFormattedMinMaxPrices([
          `${Math.round(availableMin)}€`,
          `${Math.round(availableMax)}€`,
        ]);
      }
    }

    updateMinMaxPrices();
  }, [isPro, countryCode]);

  const handleSliderChange = (value: [number, number]) => {
    setSliderValues(value);
    // Envoyer directement les valeurs formatées sans créer de paramètre combiné
    onChange(`${value[0].toFixed(2)}-${value[1].toFixed(2)}`);
  };

  // Calculer les positions des valeurs courantes en pourcentage
  const minPosition =
    ((sliderValues[0] - availableMin) / (availableMax - availableMin)) * 100;
  const maxPosition =
    ((sliderValues[1] - availableMin) / (availableMax - availableMin)) * 100;

  // Fonction pour déterminer le style de positionnement des valeurs courantes
  const getMinValueStyle = () => {
    if (minPosition <= 10) {
      // Si le curseur est très à gauche, aligner la valeur à gauche
      return { left: '0%', transform: 'translateX(0)' };
    }
    return { left: `${minPosition}%`, transform: 'translateX(-50%)' };
  };

  const getMaxValueStyle = () => {
    if (maxPosition >= 90) {
      // Si le curseur est très à droite, aligner la valeur à droite
      return { right: '0%', transform: 'translateX(0)' };
    }
    return { left: `${maxPosition}%`, transform: 'translateX(-50%)' };
  };

  return (
    <div className="space-y-4 min-w-[150px]">
      {/* Valeurs courantes affichées au-dessus des curseurs */}
      <div className="relative h-6 overflow-visible">
        {/* Valeur min */}
        <div className="absolute top-0" style={getMinValueStyle()}>
          <div className="bg-white text-xs px-2 py-1 rounded shadow-sm border whitespace-nowrap">
            {formattedPrices[0]}
          </div>
        </div>

        {/* Valeur max */}
        <div className="absolute top-0" style={getMaxValueStyle()}>
          <div className="bg-white text-xs px-2 py-1 rounded shadow-sm border whitespace-nowrap">
            {formattedPrices[1]}
          </div>
        </div>
      </div>

      {/* Slider */}
      <ReactSlider
        className="h-3 flex items-center"
        thumbClassName="w-4 h-4 bg-secondary rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-light-alt"
        trackClassName="h-1 bg-primary rounded-full"
        value={sliderValues}
        min={availableMin}
        max={availableMax}
        onChange={setSliderValues}
        onAfterChange={handleSliderChange}
        step={(availableMax - availableMin) / 100}
      />

      {/* Plage totale disponible */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Min: {formattedMinMaxPrices[0]}</span>
        <span>Max: {formattedMinMaxPrices[1]}</span>
      </div>
    </div>
  );
};

export default RangeFacet;
