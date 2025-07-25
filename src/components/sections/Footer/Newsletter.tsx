import React from 'react';
import { SubmitSvg } from './Footer';

const Newsletter = () => {
  return (
    <form>
      <label
        htmlFor="newsletter"
        className="text-white text-sm md:text-base leading-general font-bold block text-center md:text-left"
      >
        Abonnez-vous à notre newsletter
      </label>
      <div className="relative mt-2">
        <input
          type="email"
          id="newsletter"
          name="newsletter"
          placeholder="Entrez votre adresse email"
          className="py-2 px-4 h-12 bg-white border border-gray-300 rounded-full text-sm placeholder:text-placeholder-grey placeholder:text-base w-full"
        />
        <button
          type="submit"
          className="w-8 h-8 text-secondary rounded-md text-sm duration-300 hover:text-secondary-dark absolute top-[50%] right-2 transform -translate-y-1/2"
        >
          <SubmitSvg />
        </button>
      </div>
    </form>
  );
};

export default Newsletter;
