import React, { useState, useEffect, useRef } from 'react';
import ReactSlider from 'react-slider';
import { SimpleFacetValue } from './utils';
import { calculerPrix } from '@/utils/functions/prices';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type RangeFacetProps = {
  values: SimpleFacetValue[]; // Valeurs courantes des facettes
  globalValues?: SimpleFacetValue[]; // Valeurs globales pour le min/max total
  minValue: string | undefined;
  maxValue: string | undefined;
  onChange: (minMax: string) => void;
  isLoading: boolean;
};

const RangeFacet = ({
  values,
  globalValues,
  minValue,
  maxValue,
  onChange,
  isLoading,
}: RangeFacetProps) => {
  // Définir la plage totale disponible à partir des valeurs globales
  const availableRangeRef = useRef({
    min: 0,
    max: 100,
  });

  // Mettre à jour la plage totale disponible
  useEffect(() => {
    // Utiliser les valeurs globales si disponibles, sinon les valeurs courantes
    const valuesArray = globalValues || values;
    if (valuesArray?.length) {
      // Extraire et trier tous les prix numériquement
      const prices = valuesArray
        .map((v) => parseFloat(v.name))
        .filter((price) => !isNaN(price)) // Filtrer les valeurs non numériques
        .sort((a, b) => a - b);

      // Utiliser le premier et dernier prix comme min/max
      const newMin = Math.min(...prices);
      const newMax = Math.max(...prices);

      // Mettre à jour la plage uniquement si elle a changé
      if (
        newMin !== availableRangeRef.current.min ||
        newMax !== availableRangeRef.current.max
      ) {
        availableRangeRef.current = {
          min: newMin,
          max: newMax,
        };

        // Si aucune valeur n'est sélectionnée, utiliser la plage complète
        if (!minValue && !maxValue) {
          setSliderValues([newMin, newMax]);
        }
      }
    }
  }, [globalValues, values, minValue, maxValue]);

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

  // Mettre à jour les valeurs du slider quand les valeurs min/max changent
  useEffect(() => {
    const newMin = minValue ? parseFloat(minValue) : undefined;
    const newMax = maxValue ? parseFloat(maxValue) : undefined;

    if (
      newMin === undefined ||
      isNaN(newMin) ||
      newMax === undefined ||
      isNaN(newMax)
    ) {
      // Si pas de valeurs spécifiées ou valeurs invalides, utiliser la plage complète
      setSliderValues([
        availableRangeRef.current.min,
        availableRangeRef.current.max,
      ]);
    } else {
      // Utiliser les valeurs spécifiées directement
      setSliderValues([newMin, newMax]);
    }
  }, [minValue, maxValue]);

  // Mémoiser la fonction de calcul des prix pour éviter les recalculs inutiles
  const updateFormattedPrices = React.useCallback(async () => {
    try {
      const [minPrix, maxPrix] = await Promise.all([
        calculerPrix(sliderValues[0], isPro, countryCode || 'FR'),
        calculerPrix(sliderValues[1], isPro, countryCode || 'FR'),
      ]);

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
  }, [sliderValues, isPro, countryCode]);

  useEffect(() => {
    updateFormattedPrices();
  }, [updateFormattedPrices]);

  useEffect(() => {
    if (!availableRangeRef.current) return;

    async function updateMinMaxPrices() {
      try {
        const formattedMin = await calculerPrix(
          availableRangeRef.current.min,
          isPro,
          countryCode || 'FR',
        );
        const formattedMax = await calculerPrix(
          availableRangeRef.current.max,
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
          `${Math.round(availableRangeRef.current.min)}€`,
          `${Math.round(availableRangeRef.current.max)}€`,
        ]);
      }
    }

    updateMinMaxPrices();
  }, [isPro, countryCode, globalValues]);

  const handleSliderChange = (value: [number, number]) => {
    // Contraindre les valeurs à la plage disponible
    const newMin = Math.max(availableRangeRef.current.min, value[0]);
    const newMax = Math.min(availableRangeRef.current.max, value[1]);

    setSliderValues([newMin, newMax]);
    onChange(`${newMin.toFixed(2)}-${newMax.toFixed(2)}`);
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

  if (isLoading)
    return (
      <p className="text-center h-[84px] flex justify-center items-center gap-2">
        <Loader2 className="animate-spin" />
        Chargement des prix...
      </p>
    );

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
      <div className="flex justify-between text-xs text-dark-grey">
        <span>Min: {formattedMinMaxPrices[0]}</span>
        <span>Max: {formattedMinMaxPrices[1]}</span>
      </div>
    </div>
  );
};

export default RangeFacet;
