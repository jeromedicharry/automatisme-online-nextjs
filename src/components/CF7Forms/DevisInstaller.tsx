import React, { useState } from 'react';

const DevisInstaller = ({
  formId = 23651,
  installerId = '',
}: {
  formId?: number;
  installerId?: string;
}) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    aoFirstName: '',
    aoLastName: '',
    aoCompany: '',
    aoRole: '',
    aoPhone: '',
    aoEmail: '',
    aoAddress: '',
    aoPostalCode: '',
    aoCity: '',
    aoCountry: '',
    aoMessage: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Création de l'objet de données à envoyer
    const formData = new FormData();
    formData.append('ao-first-name', formState.aoFirstName);
    formData.append('ao-last-name', formState.aoLastName);
    formData.append('ao-company', formState.aoCompany);
    formData.append('ao-role', formState.aoRole);
    formData.append('ao-phone', formState.aoPhone);
    formData.append('ao-email', formState.aoEmail);
    formData.append('ao-address', formState.aoAddress);
    formData.append('ao-postal-code', formState.aoPostalCode);
    formData.append('ao-city', formState.aoCity);
    formData.append('ao-country', formState.aoCountry);
    formData.append('ao-message', formState.aoMessage);

    // Ajout de l'installer ID si fourni
    if (installerId) {
      formData.append('ao-installer-id', installerId.toString());
    }

    formData.append('_wpcf7', formId.toString());
    formData.append('_wpcf7_version', '5.8.4');
    formData.append('_wpcf7_locale', 'fr_FR');
    formData.append('_wpcf7_unit_tag', `wpcf7-f${formId}-p${formId}-o1`);

    try {
      const apiUrl = `${process.env.CF7_API_URL}${formId}/feedback`;
      console.log('Submitting to URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();
      console.log({ result });

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${result.message}`);
      }

      // Réinitialisation du formulaire après soumission réussie
      setFormState({
        aoFirstName: '',
        aoLastName: '',
        aoCompany: '',
        aoRole: '',
        aoPhone: '',
        aoEmail: '',
        aoAddress: '',
        aoPostalCode: '',
        aoCity: '',
        aoCountry: '',
        aoMessage: '',
      });

      setFormSubmitted(true);
      setErrorMessage(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormSubmitted(false);
      setErrorMessage(true);
    }
  };

  return (
    <div className="w-full">
      {formSubmitted ? (
        <div className="text-center py-8">
          <h3 className="text-2xl lg:text-4xl font-bold text-secondary mb-4">
            Merci pour votre demande de devis !
          </h3>
          <p className="text-primary text-xl text-balance max-w-[400px] mx-auto">
            {
              "Nous contactons l'installateur pour vous et vous recontacterons dès que possible."
            }
          </p>
        </div>
      ) : (
        <div>
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {"Une erreur s'est produite lors de l'envoi du formulaire."}
            </div>
          )}
          <div className="space-y-3 contact">
            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                name="aoLastName"
                id="aoLastName"
                placeholder="Nom *"
                value={formState.aoLastName}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
              <input
                type="text"
                name="aoFirstName"
                id="aoFirstName"
                placeholder="Prénom *"
                value={formState.aoFirstName}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
              <input
                type="text"
                name="aoCompany"
                id="aoCompany"
                placeholder="Société"
                value={formState.aoCompany}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
              />
              <input
                type="text"
                name="aoRole"
                id="aoRole"
                placeholder="Fonction"
                value={formState.aoRole}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
              />
              <input
                type="tel"
                name="aoPhone"
                id="aoPhone"
                placeholder="Téléphone *"
                value={formState.aoPhone}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
              <input
                type="email"
                name="aoEmail"
                id="aoEmail"
                placeholder="Email *"
                value={formState.aoEmail}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
              <input
                type="text"
                name="aoAddress"
                id="aoAddress"
                placeholder="Adresse *"
                value={formState.aoAddress}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
              <input
                type="text"
                name="aoPostalCode"
                id="aoPostalCode"
                placeholder="Code postal *"
                value={formState.aoPostalCode}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
              <input
                type="text"
                name="aoCity"
                id="aoCity"
                placeholder="Ville *"
                value={formState.aoCity}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
              <select
                name="aoCountry"
                id="aoCountry"
                value={formState.aoCountry}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full text-gray-700"
                required
              >
                <option value="">Pays *</option>
                <option value="france">France</option>
                <option value="belgique">Belgique</option>
              </select>
            </div>
            <div className="">
              <textarea
                name="aoMessage"
                id="aoMessage"
                placeholder="Quel produit souhaitez vous faire installer / réviser ? *"
                value={formState.aoMessage}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!installerId}
                className="bg-secondary py-2 px-4 rounded-sm text-white text-sm font-bold hover:bg-secondary/90 transition-colors"
              >
                Envoyer ma demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevisInstaller;
