import React, { useState } from 'react';

const ContactForm = ({ formId = 23584 }) => {
  const [errorMessage, setErrorMessage] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    aoFirstName: '',
    aoLastName: '',
    aoEmail: '',
    aoPhone: '',
    aoSubject: '',
    aoMessage: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    formData.append('ao-email', formState.aoEmail);
    formData.append('ao-phone', formState.aoPhone);
    formData.append('ao-subject', formState.aoSubject);
    formData.append('ao-message', formState.aoMessage);
    formData.append('_wpcf7_unit_tag', `wpcf7-f${formId}-o1`);

    try {
      const apiUrl = `${process.env.CF7_API_URL}${formId}/feedback`;
      console.log('Submitting to URL:', apiUrl);
      // Envoi de la demande POST à l'API REST de WordPress
      const response = await fetch(
        `${process.env.CF7_API_URL}${formId}/feedback`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const result = await response.json();
      console.log({ result });

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${result.message}`);
      }

      // Réinitialisation du formulaire après soumission réussie
      setFormState({
        aoFirstName: '',
        aoLastName: '',
        aoEmail: '',
        aoPhone: '',
        aoSubject: '',
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
            Merci pour votre message !
          </h3>
          <p className="text-primary text-xl text-balance max-w-[400px] mx-auto">
            Nous vous recontacterons dès que possible.
          </p>
        </div>
      ) : (
        <div>
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {"Une erreur s'est produite lors de l'envoi du formulaire."}
              <pre>{JSON.stringify(errorMessage, null, 2)}</pre>
            </div>
          )}
          <form className="space-y-3 contact">
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
            </div>
            <div className="">
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
            </div>
            <div className="">
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
            </div>
            <div className="">
              <input
                type="text"
                name="aoSubject"
                id="aoSubject"
                placeholder="Sujet du message *"
                value={formState.aoSubject}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                required
              />
            </div>
            <div className="">
              <textarea
                name="aoMessage"
                id="aoMessage"
                placeholder="Message"
                value={formState.aoMessage}
                onChange={handleChange}
                className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-secondary py-2 px-4 rounded-sm text-white text-sm font-bold hover:bg-secondary/90 transition-colors"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
