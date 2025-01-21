import React from 'react';

const ContactMenu = ({ themeSettings }: { themeSettings: any }) => {
  return (
    <div className="text-white">
      <p className="text-base leading-general font-bold max-sm:text-center mb-6">
        Contactez-nous
      </p>
      <div className="flex flex-col gap-2 max-md:items-center">
        <p className="font-normal text-[0.6875rem] leading-general">
          Par téléphone au
        </p>
        {themeSettings?.contactPhone && (
          <a
            href={`tel:${themeSettings?.contactPhone}`}
            className="rounded-[5px] font-bold text-base py-1 px-2 text-white leading-general bg-secondary hover:text-white duration-300 hover:bg-secondary-dark"
          >
            {themeSettings.contactPhone}
          </a>
        )}
        {themeSettings?.hours && (
          <div
            className="font-normal text-[0.6875rem] leading-general flex flex-col gap-2 max-md:text-center"
            dangerouslySetInnerHTML={{ __html: themeSettings.hours }}
          />
        )}
      </div>
    </div>
  );
};

export default ContactMenu;
