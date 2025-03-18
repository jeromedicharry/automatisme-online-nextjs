// pages/configurateur-portail.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import ProductList from '../components/ProductList';
// import ContactForm from '../components/ContactForm';

type PortailType = '2battants' | '1battant' | 'coulissant';
type UsageType = 'domestique' | 'collectif';

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
  //   const [products, setProducts] = useState<any[]>([]);
  //   const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  //   console.log({ products, showContactForm });

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
  // Générer le message
  useEffect(() => {
    if (!isFormValid()) return;

    let msg = (
      <>
        Je souhaite faire motoriser un portail pour un usage{' '}
        <span>
          {state.usage === 'domestique' ? 'domestique' : 'collectif/industriel'}
        </span>
        .{' '}
      </>
    );

    if (state.portailType === '2battants') {
      msg = (
        <>
          {msg}
          Ce dernier a <span>2 battants</span>. Les dimensions du ventail sont :
          battant gauche <span>{state.largeurGauche}mm</span> x{' '}
          <span>{state.coteAGauche}mm</span>, battant droit{' '}
          <span>{state.largeurDroite}mm</span> x{' '}
          <span>{state.coteADroite}mm</span>.{' '}
        </>
      );
    } else if (state.portailType === '1battant') {
      msg = (
        <>
          {msg}
          Ce dernier a <span>1 battant</span>. Les dimensions du ventail sont :{' '}
          <span>{state.largeur}mm</span> x <span>{state.coteA}mm</span>.{' '}
        </>
      );
    } else if (state.portailType === 'coulissant') {
      msg = (
        <>
          {msg}
          Ce dernier est <span>coulissant</span>. La largeur du ventail est de{' '}
          <span>{state.largeur}mm</span>.{' '}
        </>
      );
    }

    msg = (
      <>
        {msg} Je souhaite <span>{state.installation ? '' : 'ne pas '}</span>le
        faire installer par un professionnel.
      </>
    );

    setMessage(msg);
  }, [state]);

  // Effectuer la recherche de produits
  //   useEffect(() => {
  //     if (!isFormValid() || !message) return;

  //     fetchProducts();
  //   }, [message]);

  //   const fetchProducts = async () => {
  //     try {
  //       // Simuler une requête API pour récupérer les produits
  //       // Dans un vrai projet, vous feriez une requête GraphQL ici
  //       const response = await simulateProductFetch();
  //       setProducts(response);
  //       setShowContactForm(response.length === 0);
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération des produits:', error);
  //       setProducts([]);
  //       setShowContactForm(true);
  //     }
  //   };

  // Fonction qui simule une requête API
  //   const simulateProductFetch = () => {
  //     return new Promise<any[]>((resolve) => {
  //       setTimeout(() => {
  //         // Logique de filtrage des produits basée sur les critères
  //         const cyclesFilter =
  //           state.usage === 'domestique' ? 'cycles < 50' : 'cycles >= 50';
  //         console.log({ cyclesFilter });
  //         const typeFilter = state.portailType;
  //         const installationFilter = state.installation;

  //         // Simulation de produits
  //         const mockProducts = [
  //           {
  //             id: 1,
  //             name: 'Motorisation 2 battants Basic',
  //             type: '2battants',
  //             cycles: 30,
  //             hasPose: true,
  //           },
  //           {
  //             id: 2,
  //             name: 'Motorisation 2 battants Pro',
  //             type: '2battants',
  //             cycles: 60,
  //             hasPose: true,
  //           },
  //           {
  //             id: 3,
  //             name: 'Motorisation 1 battant Standard',
  //             type: '1battant',
  //             cycles: 40,
  //             hasPose: false,
  //           },
  //           {
  //             id: 4,
  //             name: 'Motorisation Coulissante 800',
  //             type: 'coulissant',
  //             cycles: 35,
  //             hasPose: true,
  //           },
  //         ];

  //         // Filtrage des produits
  //         const filteredProducts = mockProducts.filter((product) => {
  //           const matchesType = product.type === typeFilter;
  //           const matchesCycles =
  //             state.usage === 'domestique'
  //               ? product.cycles < 50
  //               : product.cycles >= 50;
  //           const matchesInstallation =
  //             installationFilter === null ||
  //             product.hasPose === installationFilter;

  //           // Ajoutez ici votre logique de filtrage pour les dimensions
  //           // Cette partie dépendra de la structure de vos produits

  //           return matchesType && matchesCycles && matchesInstallation;
  //         });

  //         resolve(filteredProducts);
  //       }, 500);
  //     });
  //   };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setIsSubmitted(true);
      //   fetchProducts();
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
              <label htmlFor="porte-garage">Collectif / Industriel</label>
              <input
                type="radio"
                name="usage"
                value="collectif"
                checked={state.usage === 'collectif'}
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
              Dimensions du ventail
            </h2>
            <em>
              {
                "Note importante : configuré pour un angle maximum d'ouverture de 100° et une prise au vent standard. En cas de ventaux pleins ou si vous souhaitez un angle d'ouverture supérieur, des solutions existent, n'hésitez pas à nous contacter au 03 67 70 00 00."
              }
            </em>

            {state.portailType === '2battants' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Battant gauche</h3>
                    <div>
                      <label className="block mb-1">
                        Largeur gauche (en mm){' '}
                        <span className="text-sm text-gray-500">(maximum)</span>
                      </label>
                      <input
                        type="number"
                        name="largeurGauche"
                        value={state.largeurGauche || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Côté A gauche (en mm){' '}
                        <span className="text-sm text-gray-500">(minimum)</span>
                      </label>
                      <input
                        type="number"
                        name="coteAGauche"
                        value={state.coteAGauche || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Côté B gauche (en mm){' '}
                        <span className="text-sm text-gray-500">(minimum)</span>
                      </label>
                      <input
                        type="number"
                        name="coteBGauche"
                        value={state.coteBGauche || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Côté C gauche (en mm){' '}
                        <span className="text-sm text-gray-500">(minimum)</span>
                      </label>
                      <input
                        type="number"
                        name="coteCGauche"
                        value={state.coteCGauche || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Battant droit</h3>
                    <div>
                      <label className="block mb-1">
                        Largeur droite (en mm){' '}
                        <span className="text-sm text-gray-500">(maximum)</span>
                      </label>
                      <input
                        type="number"
                        name="largeurDroite"
                        value={state.largeurDroite || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Côté A droite (en mm){' '}
                        <span className="text-sm text-gray-500">(minimum)</span>
                      </label>
                      <input
                        type="number"
                        name="coteADroite"
                        value={state.coteADroite || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Côté B droite (en mm){' '}
                        <span className="text-sm text-gray-500">(minimum)</span>
                      </label>
                      <input
                        type="number"
                        name="coteBDroite"
                        value={state.coteBDroite || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Côté C droite (en mm){' '}
                        <span className="text-sm text-gray-500">(minimum)</span>
                      </label>
                      <input
                        type="number"
                        name="coteCDroite"
                        value={state.coteCDroite || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  </div>
                </div>
                <em className="mt-2 block">
                  {
                    'Note importante : La valeur la plus contraignante entre battant droit et gauche est prise en compte pour le dimensionnement de la motorisation'
                  }
                </em>
              </>
            )}

            {state.portailType === '1battant' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">
                    Largeur (en mm){' '}
                    <span className="text-sm text-gray-500">(maximum)</span>
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
                    Côté A (en mm){' '}
                    <span className="text-sm text-gray-500">(minimum)</span>
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
                    Côté B (en mm){' '}
                    <span className="text-sm text-gray-500">(minimum)</span>
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
                    Côté C (en mm){' '}
                    <span className="text-sm text-gray-500">(minimum)</span>
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
            )}

            {state.portailType === 'coulissant' && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">
                    Largeur (en mm){' '}
                    <span className="text-sm text-gray-500">(maximum)</span>
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

      {/* Résultats */}
      {isSubmitted && (
        <div className="mt-10 space-y-8">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold mb-4">
              Liste des produits à afficher. Si vide, formulaire prérempli avec
              le message
            </h2>
          </div>

          {/* {products.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Produits recommandés</h2>
              <ProductList products={products} />
            </div>
          ) : showContactForm ? (
            <ContactForm message={message} />
          ) : null} */}
        </div>
      )}
    </div>
  );
}
