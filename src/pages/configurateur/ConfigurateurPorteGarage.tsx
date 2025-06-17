// pages/configurateur-porte-garage.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  ContrepoidsSvg,
  RessortSvg,
  SectionnelleSvg,
} from '@/components/SVG/ConfigurateurIcons';

type PorteType = 'sectionnelle' | 'ressort' | 'contrepoids';

export interface PorteGarageConfiguratorState {
  porteType: PorteType | null;
  hauteur?: number;
  poids?: number;
  surface?: number;
  installation: boolean | null;
}

export default function ConfigurateurPorteGarage({ setMessage }: any) {
  const router = useRouter();
  const [state, setState] = useState<PorteGarageConfiguratorState>({
    porteType: null,
    installation: null,
  });

  // Chargement des données depuis l'URL
  useEffect(() => {
    if (!router.isReady) return;

    const { porteType, hauteur, poids, surface, installation } = router.query;

    const newState: PorteGarageConfiguratorState = {
      porteType: (porteType as PorteType) || null,
      installation:
        installation === 'true'
          ? true
          : installation === 'false'
            ? false
            : null,
    };

    if (hauteur) newState.hauteur = Number(hauteur);
    if (poids) newState.poids = Number(poids);
    if (surface) newState.surface = Number(surface);

    setState(newState);
  }, []);

  // Mise à jour de l'URL lorsque l'état change
  useEffect(() => {
    if (!router.isReady) return;

    const query: Record<string, string> = {};
    if (state.porteType) query.porteType = state.porteType;
    if (state.installation !== null)
      query.installation = String(state.installation);
    if (state.hauteur) query.hauteur = String(state.hauteur);
    if (state.poids) query.poids = String(state.poids);
    if (state.surface) query.surface = String(state.surface);

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  }, [state, router.isReady]);

  // Générer le message
  useEffect(() => {
    let msg = (
      <>
        Je souhaite faire motoriser une porte de garage
        {state.porteType && (
          <>
            {' '}
            <span>
              {state.porteType === 'sectionnelle' && 'sectionnelle'}
              {state.porteType === 'ressort' && 'basculante à ressort'}
              {state.porteType === 'contrepoids' && 'à contrepoids'}
            </span>
          </>
        )}
        {state.hauteur && state.surface && state.poids && (
          <>
            . Ses dimensions sont <span>{state.hauteur}m</span> x{' '}
            <span>{state.surface}m</span> et son poids est de{' '}
            <span>{state.poids}kg</span>.
          </>
        )}
        {state.installation !== null && state.installation !== undefined && (
          <>
            {' '}
            Je souhaite{' '}
            <span>
              {state.installation ? '' : 'ne pas '}la faire installer par un
              professionnel.
            </span>
          </>
        )}
      </>
    );

    setMessage(msg);
  }, [state]);

  const isFormValid = () => {
    return !!(
      state.porteType &&
      state.hauteur &&
      state.poids &&
      state.surface &&
      state.installation !== null
    );
  };

  const buildUrlAndRedirect = () => {
    let baseUrl = '/categorie/motorisation-de-porte-de-garage';

    // Ajouter la sous-catégorie selon le type
    if (state.porteType === 'sectionnelle' || state.porteType === 'ressort') {
      baseUrl +=
        '/motorisation-pour-porte-de-garage-sectionnelle-ou-basculante-a-ressort';
    } else if (state.porteType === 'contrepoids') {
      baseUrl += '/motorisation-pour-porte-de-garage-a-contre-poids';
    }

    const params = new URLSearchParams();

    // Type de porte
    if (state.porteType) {
      params.set('porteType', state.porteType);
    }

    // Installation
    if (state.installation !== null) {
      params.set('_has_pose', String(state.installation));
    }

    // Dimensions (valeurs max)
    if (state.hauteur) params.set('hauteurMax', String(state.hauteur));
    if (state.poids) params.set('poidsMax', String(state.poids));
    if (state.surface) params.set('surfaceMax', String(state.surface));

    const searchUrl = `${baseUrl}?${params.toString()}`;
    router.push(searchUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      buildUrlAndRedirect();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setState((prev) => ({
        ...prev,
        [name]: value === 'true' ? true : value === 'false' ? false : value,
      }));
    } else if (type === 'number') {
      setState((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Étape 1: Type de porte */}
        <div className="mt-6 md:mt-10">
          <h2 className="font-medium text-xl leading-general mb-4">
            Ma porte de garage est de type
          </h2>
          <div className="flex items-center gap-4 justify-start flex-wrap">
            <div className="configurator-radio">
              <SectionnelleSvg />
              <label htmlFor="sectionnelle">Sectionnelle</label>
              <input
                type="radio"
                name="porteType"
                value="sectionnelle"
                checked={state.porteType === 'sectionnelle'}
                onChange={handleChange}
                required
              />
            </div>
            <div className="configurator-radio">
              <RessortSvg />
              <label htmlFor="ressort">À ressort</label>
              <input
                type="radio"
                name="porteType"
                value="ressort"
                checked={state.porteType === 'ressort'}
                onChange={handleChange}
                required
              />
            </div>
            <div className="configurator-radio">
              <ContrepoidsSvg />
              <label htmlFor="contrepoids">À contre poids</label>
              <input
                type="radio"
                name="porteType"
                value="contrepoids"
                checked={state.porteType === 'contrepoids'}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Étape 2: Dimensions */}
        {state.porteType && (
          <div className="mt-6 md:mt-10">
            <h2 className="font-medium text-xl leading-general mb-4">
              À savoir !
            </h2>
            <div className="bg-white p-3 md:p-4 rounded mb-4 md:mb-6">
              La configuration est prévue pour{' '}
              <strong>{"des conditions d'utilisation standard."}</strong> En cas
              de <strong>conditions particulières ou de doutes</strong>
              {", n'hésitez pas à nous contacter au"}{' '}
              <span className="font-bold text-secondary">03 67 70 00 00</span>
            </div>
            <h2 className="font-medium text-xl leading-general mb-4">
              Dimensions de ma porte de garage (en m)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">
                  Largeur
                  <span className="text-sm text-dark-grey"> (maximum)</span>
                </label>
                <input
                  type="number"
                  name="surface"
                  value={state.surface || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  step="0.1"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">
                  Hauteur
                  <span className="text-sm text-dark-grey"> (maximum)</span>
                </label>
                <input
                  type="number"
                  name="hauteur"
                  value={state.hauteur || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  step="0.1"
                  min="0"
                  required
                />
              </div>
            </div>
            <h2 className="font-medium text-xl leading-general mb-4 mt-4 md:mt-6">
              Poids (en kg){' '}
              <span className="text-sm text-dark-grey font-normal">
                (maximum)
              </span>
            </h2>
            <div>
              <input
                type="number"
                name="poids"
                value={state.poids || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                required
              />
            </div>
          </div>
        )}

        {/* Étape 3: Installation */}
        {state.porteType && (
          <div className="mt-6 md:mt-10">
            <h2 className="font-medium text-xl leading-general mb-4">
              {"Souhaitez-vous l'installation par un professionnel ?"}
            </h2>
            <div className="flex items-center gap-4">
              <div className="configurator-radio">
                <label className="">Oui</label>
                <input
                  type="radio"
                  name="installation"
                  value="true"
                  checked={state.installation === true}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="configurator-radio">
                <label className="">Non</label>
                <input
                  type="radio"
                  name="installation"
                  value="false"
                  checked={state.installation === false}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="">
          <button
            type="submit"
            className={`bg-primary duration-300 hover:bg-primary-dark text-white min-h-[43px] rounded-[5px] min-w-[170px] text-base leading-general px-4 py-2 gap-2 disabled:bg-gray-400`}
            disabled={!isFormValid()}
          >
            Trouver ma motorisation
          </button>
        </div>
      </form>
    </div>
  );
}
