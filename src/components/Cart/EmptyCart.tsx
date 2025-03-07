import React from 'react';
import Cta from '../atoms/Cta';

const EmptyCart = () => {
  return (
    <section className="py-8 px-4 lg:py-[38px] bg-white flex flex-col shadow-card text-center mb-16">
      <div className="flex justify-center">
        <LargeCartSvg />
      </div>

      <h2 className="mt-2 text-2xl font-bold">Votre panier est vide</h2>
      <div className="text-sm mt-2 mb-6 md:mb-4 text-balance">
        {
          "Vous n'avez encore rien ajouté à votre panier. Visitez la boutique dès maintenant !"
        }
      </div>

      <Cta
        label="Retour à l'accueil"
        slug="/"
        size="default"
        variant="primary"
        isFull={false}
      >
        {'Voir les produits'}
      </Cta>
    </section>
  );
};

export default EmptyCart;

export const LargeCartSvg = () => {
  return (
    <svg
      width="82"
      height="62"
      viewBox="0 0 82 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60.7461 16.7818C59.7245 15.5561 58.2107 14.8465 56.6155 14.8499H27.6096L27.5349 14.2183C27.2159 11.5088 24.9215 9.46484 22.1926 9.46484H21.7955C20.8044 9.46484 20 10.2695 20 11.261C20 12.2524 20.8044 13.0571 21.7955 13.0571H22.1926C23.1022 13.0571 23.8659 13.7396 23.9745 14.6427L26.442 35.6395C26.9715 40.1587 30.8 43.5677 35.3515 43.5677H54.0869C55.078 43.5677 55.8824 42.763 55.8824 41.7715C55.8824 40.7801 55.078 39.9754 54.0869 39.9754H35.3515C33.0775 39.9686 31.0512 38.5324 30.2943 36.3865H51.6771C56.0181 36.3865 59.7347 33.2798 60.5051 29.005L61.9137 21.1924C62.1988 19.6237 61.7711 18.0075 60.7461 16.7852V16.7818ZM58.3906 20.5506L56.9821 28.3633C56.5205 30.9302 54.2837 32.7976 51.6771 32.7908H29.7241L28.0372 18.4353H56.6189C57.6099 18.4285 58.4178 19.2264 58.4245 20.2179C58.4245 20.3299 58.4143 20.4386 58.3974 20.5472L58.3906 20.5506Z"
        fill="#042B60"
      />
      <path
        d="M32.5582 52.5347C34.5396 52.5347 36.1458 50.9279 36.1458 48.9458C36.1458 46.9637 34.5396 45.3569 32.5582 45.3569C30.5769 45.3569 28.9707 46.9637 28.9707 48.9458C28.9707 50.9279 30.5769 52.5347 32.5582 52.5347Z"
        fill="#042B60"
      />
      <path
        d="M50.4958 52.5347C52.4771 52.5347 54.0833 50.9279 54.0833 48.9458C54.0833 46.9637 52.4771 45.3569 50.4958 45.3569C48.5144 45.3569 46.9082 46.9637 46.9082 48.9458C46.9082 50.9279 48.5144 52.5347 50.4958 52.5347Z"
        fill="#042B60"
      />
    </svg>
  );
};
