import React from 'react';

const AddInstallation = ({
  installationPrice,
  addInstallation,
  setAddInstallation,
}: {
  installationPrice: number;
  addInstallation: boolean;
  setAddInstallation: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <p className="mb-4 font-bold">{"Choix de l'option"}</p>
      <div className="flex w-full md:w-fit gap-4 items-stretch">
        <label className="cursor-pointer">
          <input
            type="radio"
            name="option"
            value="option1"
            className="hidden peer"
            checked={addInstallation}
            onChange={() => setAddInstallation(true)}
          />
          <span className="block relative font-bold px-5 py-3 border border-primary rounded-md peer-checked:bg-primary-light duration-300 md:min-w-[220px]">
            <div className="absolute font-normal bg-secondary text-white text-xs leading-general px-1 py-1/2 rounded-[3px] top-0 -translate-y-1/2 right-4">
              Recommandé
            </div>
            <p>Avec installation</p>
            <div className="text-dark-grey font-normal">
              (+{installationPrice}€ TTC)
            </div>
          </span>
        </label>
        <label className="cursor-pointer">
          <input
            type="radio"
            name="option"
            value="option2"
            className="hidden peer"
            checked={!addInstallation}
            onChange={() => setAddInstallation(false)}
          />
          <span className="flex items-center px-5 py-3 font-bold border h-full border-primary rounded-md peer-checked:bg-primary-light duration-300 md:min-w-[220px]">
            Sans installation
          </span>
        </label>
      </div>
    </>
  );
};

export default AddInstallation;
