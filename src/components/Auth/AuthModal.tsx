// components/Auth/AuthModal.tsx
import React, { Dispatch, SetStateAction, useState } from 'react';
import Modal from '@/components/Modals/Modal';
import LogInForm from '@/components/Auth/LoginForm';
import SignUpForm from '@/components/Auth/SignUpForm';
import SendPasswordResetEmailForm from '@/components/Auth/SendPasswordResetEmailForm';
import { FormStatusProps } from '@/hooks/useAuthModal';

//todo gérer le reset email

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  formStatus: FormStatusProps;
  setFormStatus: Dispatch<SetStateAction<FormStatusProps>>;
  isNotClosable?: boolean;
}
export type RegisterTypeProps = 'customer' | 'pro_customer';

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  formStatus,
  setFormStatus,
  isNotClosable = false,
}) => {
  const [registerType, setRegisterType] =
    useState<RegisterTypeProps>('customer'); // ✅ Typage explicite
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isNotClosable={isNotClosable}
      size="small"
    >
      {formStatus === 'register' ? (
        <SignUpForm
          setFormStatus={setFormStatus}
          handleCloseModal={onClose}
          registerType={registerType}
          setRegisterType={setRegisterType}
        />
      ) : formStatus === 'login' ? (
        <LogInForm
          setFormStatus={setFormStatus}
          handleCloseModal={onClose}
          setRegisterType={setRegisterType}
        />
      ) : formStatus === 'forgot-password' ? (
        <SendPasswordResetEmailForm
          setFormStatus={setFormStatus}
          handleCloseModal={onClose}
        />
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default AuthModal;
