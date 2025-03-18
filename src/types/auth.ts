import { RegisterTypeProps } from '@/components/Auth/AuthModal';
import React from 'react';

export type AuthFormProps = {
  setFormStatus: React.Dispatch<
    React.SetStateAction<'login' | 'register' | 'forgot-password' | 'reset'>
  >;
  registerType?: RegisterTypeProps;
  setRegisterType: React.Dispatch<
    React.SetStateAction<'customer' | 'pro_customer'>
  >;
  handleCloseModal: () => void;
};
