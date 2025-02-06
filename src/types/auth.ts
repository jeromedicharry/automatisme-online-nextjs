import React from 'react';

export type AuthFormProps = {
  setFormStatus: React.Dispatch<
    React.SetStateAction<'login' | 'register' | 'reset'>
  >;
  handleCloseModal: () => void;
};
