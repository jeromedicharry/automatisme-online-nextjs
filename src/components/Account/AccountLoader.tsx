import React from 'react';

const AccountLoader = ({ text }: { text: string }) => {
  return (
    <p className="py-8 px-4 lg:py-[38px] bg-white flex flex-col shadow-card text-center rounded-lg w-full text-xl lg:text-2xl mb-6">
      {text}
    </p>
  );
};

export default AccountLoader;
