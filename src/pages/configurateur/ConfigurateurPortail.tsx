// pages/configurateur-portail.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  CoulissantSvg,
  PortailSvg,
  UnBattantSvg,
} from '@/components/SVG/ConfigurateurIcons';
import Image from 'next/image';

type PortailType = '2battants' | '1battant' | 'coulissant';
type UsageType = 'domestique' | 'collectif' | 'industriel';

export interface PortailConfiguratorState {
  usage: UsageType | null;
  portailType: PortailType | null;
  largeurGauche?: number;
  coteAGauche?: number;
  coteBGauche?: number;
  coteCGauche?: number;
  largeurDroite?: number;
  coteADroite?: number;
  coteBDroite?: number;
  coteCDroite?: number;
  largeur?: number;
  coteA?: number;
  coteB?: number;
  coteC?: number;
  installation: boolean | null;
}

export default function ConfigurateurPortail({ setMessage }: any) {
  const router = useRouter();
  const [state, setState] = useState<PortailConfiguratorState>({
    usage: null,
    portailType: null,
    installation: null,
  });
  const [configuratorMessage, setConfiguratorMessage] = useState<string>('');

  // Chargement des données depuis l'URL
  useEffect(() => {
    if (!router.isReady) return;

    const {
      usage,
      portailType,
      largeurGauche,
      coteAGauche,
      coteBGauche,
      coteCGauche,
      largeurDroite,
      coteADroite,
      coteBDroite,
      coteCDroite,
      largeur,
      coteA,
      coteB,
      coteC,
      installation,
    } = router.query;

    const newState: PortailConfiguratorState = {
      usage: (usage as UsageType) || null,
      portailType: (portailType as PortailType) || null,
      installation:
        installation === 'true'
          ? true
          : installation === 'false'
            ? false
            : null,
    };

    if (largeurGauche) newState.largeurGauche = Number(largeurGauche);
    if (coteAGauche) newState.coteAGauche = Number(coteAGauche);
    if (coteBGauche) newState.coteBGauche = Number(coteBGauche);
    if (coteCGauche) newState.coteCGauche = Number(coteCGauche);
    if (largeurDroite) newState.largeurDroite = Number(largeurDroite);
    if (coteADroite) newState.coteADroite = Number(coteADroite);
    if (coteBDroite) newState.coteBDroite = Number(coteBDroite);
    if (coteCDroite) newState.coteCDroite = Number(coteCDroite);
    if (largeur) newState.largeur = Number(largeur);
    if (coteA) newState.coteA = Number(coteA);
    if (coteB) newState.coteB = Number(coteB);
    if (coteC) newState.coteC = Number(coteC);

    setState(newState);
  }, []);

  // Mise à jour de l'URL lorsque l'état change
  useEffect(() => {
    if (!router.isReady) return;

    const query: Record<string, string> = {};
    if (state.usage) query.usage = state.usage;
    if (state.portailType) query.portailType = state.portailType;
    if (state.installation !== null)
      query.installation = String(state.installation);

    if (state.portailType === '2battants') {
      if (state.largeurGauche)
        query.largeurGauche = String(state.largeurGauche);
      if (state.coteAGauche) query.coteAGauche = String(state.coteAGauche);
      if (state.coteBGauche) query.coteBGauche = String(state.coteBGauche);
      if (state.coteCGauche) query.coteCGauche = String(state.coteCGauche);
      if (state.largeurDroite)
        query.largeurDroite = String(state.largeurDroite);
      if (state.coteADroite) query.coteADroite = String(state.coteADroite);
      if (state.coteBDroite) query.coteBDroite = String(state.coteBDroite);
      if (state.coteCDroite) query.coteCDroite = String(state.coteCDroite);
    } else if (state.portailType === '1battant') {
      if (state.largeur) query.largeur = String(state.largeur);
      if (state.coteA) query.coteA = String(state.coteA);
      if (state.coteB) query.coteB = String(state.coteB);
      if (state.coteC) query.coteC = String(state.coteC);
    } else if (state.portailType === 'coulissant') {
      if (state.largeur) query.largeur = String(state.largeur);
    }

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
        Je souhaite faire motoriser un portail
        {state.usage && (
          <>
            {' '}
            pour un usage{' '}
            <span>
              {state.usage === 'domestique'
                ? 'domestique'
                : 'collectif/industriel'}
            </span>
            .
          </>
        )}
      </>
    );

    let textMessage = `Je souhaite faire motoriser un portail${
      state.usage
        ? ` pour un usage ${state.usage === 'domestique' ? 'domestique' : 'collectif/industriel'}`
        : ''
    }.`;

    if (state.portailType === '2battants') {
      msg = (
        <>
          {msg} Ce dernier a <span>2 battants</span>.
          {state.largeurGauche &&
            state.coteAGauche &&
            state.largeurDroite &&
            state.coteADroite && (
              <>
                {' '}
                Les dimensions du ventail sont : battant gauche{' '}
                <span>{state.largeurGauche}mm</span> x{' '}
                <span>{state.coteAGauche}mm</span>, battant droit{' '}
                <span>{state.largeurDroite}mm</span> x{' '}
                <span>{state.coteADroite}mm</span>.
              </>
            )}
        </>
      );
      textMessage += ` Ce dernier a 2 battants.`;
      if (
        state.largeurGauche &&
        state.coteAGauche &&
        state.largeurDroite &&
        state.coteADroite
      ) {
        textMessage += ` Les dimensions du ventail sont : battant gauche ${state.largeurGauche}mm x ${state.coteAGauche}mm, battant droit ${state.largeurDroite}mm x ${state.coteADroite}mm.`;
      }
    } else if (state.portailType === '1battant') {
      msg = (
        <>
          {msg} Ce dernier a <span>1 battant</span>.
          {state.largeur && state.coteA && (
            <>
              {' '}
              Les dimensions du ventail sont : <span>
                {state.largeur}mm
              </span> x <span>{state.coteA}mm</span>.
            </>
          )}
        </>
      );
      textMessage += ` Ce dernier a 1 battant.`;
      if (state.largeur && state.coteA) {
        textMessage += ` Les dimensions du ventail sont : ${state.largeur}mm x ${state.coteA}mm.`;
      }
    } else if (state.portailType === 'coulissant') {
      msg = (
        <>
          {msg} Ce dernier est <span>coulissant</span>.
          {state.largeur && (
            <>
              {' '}
              La largeur du ventail est de <span>{state.largeur}mm</span>.
            </>
          )}
        </>
      );
      textMessage += ` Ce dernier est coulissant.`;
      if (state.largeur) {
        textMessage += ` La largeur du ventail est de ${state.largeur}mm.`;
      }
    }

    if (state.installation !== null && state.installation !== undefined) {
      msg = (
        <>
          {msg} Je souhaite{' '}
          <span>
            {state.installation ? '' : 'ne pas '}le faire installer par un
            professionnel.
          </span>
        </>
      );
      textMessage += ` Je souhaite ${state.installation ? '' : 'ne pas '}le faire installer par un professionnel.`;
    }

    setMessage(msg);
    setConfiguratorMessage(textMessage);
  }, [state]);

  const isFormValid = () => {
    if (!state.usage || !state.portailType || state.installation === null)
      return false;

    if (state.portailType === '2battants') {
      return !!(
        state.largeurGauche &&
        state.coteAGauche &&
        state.coteBGauche &&
        state.coteCGauche &&
        state.largeurDroite &&
        state.coteADroite &&
        state.coteBDroite &&
        state.coteCDroite
      );
    } else if (state.portailType === '1battant') {
      return !!(state.largeur && state.coteA && state.coteB && state.coteC);
    } else if (state.portailType === 'coulissant') {
      return !!state.largeur;
    }

    return false;
  };

  const buildUrlAndRedirect = () => {
    const baseUrl = '/categorie/motorisation-de-portail';
    const params = new URLSearchParams();

    // Usage mapping
    if (state.usage) {
      const usageMapping: Record<string, string> = {
        domestique: 'residentiel',
        industriel: 'industriel',
        collectif: 'collectif',
      };
      params.set('usage', usageMapping[state.usage]);
    }

    // Portal type
    if (state.portailType) {
      params.set('portailType', state.portailType);
    }

    // Installation
    if (state.installation !== null) {
      params.set('_has_pose', String(state.installation));
    }

    // Dimensional facets for 2battants
    if (state.portailType === '2battants') {
      if (state.largeurGauche)
        params.set('largeurGaucheMin', String(state.largeurGauche));
      if (state.coteAGauche)
        params.set('coteAGaucheMin', String(state.coteAGauche));
      if (state.coteBGauche)
        params.set('coteBGaucheMax', String(state.coteBGauche));
      if (state.coteCGauche)
        params.set('coteCGaucheMin', String(state.coteCGauche));

      if (state.largeurDroite)
        params.set('largeurDroiteMin', String(state.largeurDroite));
      if (state.coteADroite)
        params.set('coteADroiteMin', String(state.coteADroite));
      if (state.coteBDroite)
        params.set('coteBDroiteMax', String(state.coteBDroite));
      if (state.coteCDroite)
        params.set('coteCDroiteMin', String(state.coteCDroite));
    }
    // Dimensional facets for 1battant
    else if (state.portailType === '1battant') {
      if (state.largeur) params.set('largeurMin', String(state.largeur));
      if (state.coteA) params.set('coteAMin', String(state.coteA));
      if (state.coteB) params.set('coteBMax', String(state.coteB));
      if (state.coteC) params.set('coteCMin', String(state.coteC));
    }
    // Dimensional facets for coulissant
    else if (state.portailType === 'coulissant') {
      if (state.largeur) params.set('largeurMin', String(state.largeur));
      if (state.coteA) params.set('coteAMin', String(state.coteA));
      if (state.coteB) params.set('coteBMax', String(state.coteB));
      if (state.coteC) params.set('coteCMin', String(state.coteC));
    }

    const searchUrl = `${baseUrl}?${params.toString()}`;
    router.push(searchUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      localStorage.setItem(
        'configuratorMessage',
        JSON.stringify(configuratorMessage),
      );
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
        {/* Étape 1: Type d'usage */}
        <div className="mt-6 md:mt-10">
          <h2 className="font-medium text-xl leading-general mb-4">
            {"J'en ai un usage"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="configurator-radio">
              <label htmlFor="usage">Domestique</label>
              <input
                type="radio"
                name="usage"
                value="domestique"
                checked={state.usage === 'domestique'}
                onChange={handleChange}
                required
              />
            </div>
            <div className="configurator-radio">
              <label htmlFor="porte-garage">Collectif</label>
              <input
                type="radio"
                name="usage"
                value="collectif"
                checked={state.usage === 'collectif'}
                onChange={handleChange}
                required
              />
            </div>
            <div className="configurator-radio">
              <label htmlFor="porte-garage">Industriel</label>
              <input
                type="radio"
                name="usage"
                value="industriel"
                checked={state.usage === 'industriel'}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Étape 2: Type de portail */}
        {state.usage && (
          <div className="mt-6 md:mt-10">
            <h2 className="font-medium text-xl leading-general mb-4">
              Mon portail est de type
            </h2>
            <div className="flex items-center gap-4">
              <div className="configurator-radio">
                <div className="shrink-0">
                  <PortailSvg />
                </div>

                <label className="">2 battants</label>
                <input
                  type="radio"
                  name="portailType"
                  value="2battants"
                  checked={state.portailType === '2battants'}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="configurator-radio">
                <div className="shrink-0">
                  <UnBattantSvg />
                </div>
                <label className="">1 battant</label>
                <input
                  type="radio"
                  name="portailType"
                  value="1battant"
                  checked={state.portailType === '1battant'}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="configurator-radio">
                <div className="shrink-0">
                  <CoulissantSvg />
                </div>
                <label className="">Coulissant</label>
                <input
                  type="radio"
                  name="portailType"
                  value="coulissant"
                  checked={state.portailType === 'coulissant'}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Dimensions */}
        {state.portailType && (
          <div className="mt-6 md:mt-10">
            <h2 className="font-medium text-xl leading-general mb-4">
              À savoir !
            </h2>
            <div className="bg-white p-3 md:p-4 rounded mb-4 md:mb-6">
              La configuration est prévue pour{' '}
              <strong>
                {
                  'un angle d’ouverture de 100° maximum et une prise au vent standard.'
                }
              </strong>
              En cas de{' '}
              <strong>
                {
                  "vantaux pleins ou si vous souhaitez un angle d'ouverture supérieur"
                }
              </strong>
              {", des solutions existent, n'hésitez pas à nous contacter au"}{' '}
              <span className="font-bold text-secondary">03 67 70 00 00</span>
            </div>
            <h2 className="font-medium text-xl leading-general mb-4">
              Dimensions du portail (en mm)
            </h2>

            {state.portailType === '2battants' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Battant gauche</h3>
                    <div>
                      <label className="block mb-1">
                        Largeur gauche (en mm){' '}
                        <span className="text-sm text-dark-grey">
                          (maximum)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="largeurGauche"
                        value={state.largeurGauche || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Cote A gauche (en mm){' '}
                        <span className="text-sm text-dark-grey">
                          (minimum)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="coteAGauche"
                        value={state.coteAGauche || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Cote B gauche (en mm){' '}
                        <span className="text-sm text-dark-grey">
                          (maximum)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="coteBGauche"
                        value={state.coteBGauche || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Cote C gauche (en mm){' '}
                        <span className="text-sm text-dark-grey">
                          (minimum)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="coteCGauche"
                        value={state.coteCGauche || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Battant droit</h3>
                    <div>
                      <label className="block mb-1">
                        Largeur droite (en mm){' '}
                        <span className="text-sm text-dark-grey">
                          (maximum)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="largeurDroite"
                        value={state.largeurDroite || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Cote A droite (en mm){' '}
                        <span className="text-sm text-dark-grey">
                          (minimum)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="coteADroite"
                        value={state.coteADroite || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Cote B droite (en mm){' '}
                        <span className="text-sm text-dark-grey">
                          (maximum)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="coteBDroite"
                        value={state.coteBDroite || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Cote C droite (en mm){' '}
                        <span className="text-sm text-dark-grey">
                          (minimum)
                        </span>
                      </label>
                      <input
                        type="number"
                        name="coteCDroite"
                        value={state.coteCDroite || ''}
                        onChange={handleChange}
                        className="w-full p-2 rounded"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:flex-row mt-6 md:mt-10 mb-6 md:mb-10">
                  <Image
                    src="/images/configurateur/2battants-1.jpg"
                    alt="schema"
                    width={380}
                    height={205}
                    className="max-md:w-full max-xxl:w-1/2"
                  />
                  <Image
                    src="/images/configurateur/2battants-2.jpg"
                    alt="schema"
                    width={380}
                    height={205}
                    className="max-md:w-full max-xxl:w-1/2"
                  />
                </div>
                <em className="mt-2 block">
                  {
                    'Note importante : La valeur la plus contraignante entre battant droit et gauche est prise en compte pour le dimensionnement de la motorisation'
                  }
                </em>
              </>
            )}

            {state.portailType === '1battant' && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">
                      Largeur (en mm){' '}
                      <span className="text-sm text-dark-grey">(maximum)</span>
                    </label>
                    <input
                      type="number"
                      name="largeur"
                      value={state.largeur || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Cote A (en mm){' '}
                      <span className="text-sm text-dark-grey">(minimum)</span>
                    </label>
                    <input
                      type="number"
                      name="coteA"
                      value={state.coteA || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Cote B (en mm){' '}
                      <span className="text-sm text-dark-grey">(maximum)</span>
                    </label>
                    <input
                      type="number"
                      name="coteB"
                      value={state.coteB || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Cote C (en mm){' '}
                      <span className="text-sm text-dark-grey">(minimum)</span>
                    </label>
                    <input
                      type="number"
                      name="coteC"
                      value={state.coteC || ''}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:flex-row mt-6 md:mt-10 mb-6 md:mb-10">
                  <Image
                    src="/images/configurateur/2battants-1.jpg"
                    alt="schema"
                    width={380}
                    height={205}
                  />
                  <Image
                    src="/images/configurateur/2battants-2.jpg"
                    alt="schema"
                    width={380}
                    height={205}
                  />
                </div>
              </>
            )}

            {state.portailType === 'coulissant' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">
                    Largeur (en mm){' '}
                    <span className="text-sm text-dark-grey">(maximum)</span>
                  </label>
                  <input
                    type="number"
                    name="largeur"
                    value={state.largeur || ''}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Étape 4: Installation */}
        {state.portailType && (
          <div className="mt-6 md:mt-10">
            <h2 className="font-medium text-xl leading-general mb-4">
              {" Souhaitez-vous l'installation par un professionnel ?"}
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
