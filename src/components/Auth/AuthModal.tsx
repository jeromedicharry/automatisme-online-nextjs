// components/Auth/AuthModal.tsx
import React, { Dispatch, SetStateAction } from 'react';
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

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  formStatus,
  setFormStatus,
  isNotClosable = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isNotClosable={isNotClosable}
      size="small"
    >
      {formStatus === 'register' ? (
        <SignUpForm setFormStatus={setFormStatus} handleCloseModal={onClose} />
      ) : formStatus === 'login' ? (
        <LogInForm setFormStatus={setFormStatus} handleCloseModal={onClose} />
      ) : formStatus === 'reset' ? (
        <SendPasswordResetEmailForm
        //   setFormStatus={setFormStatus}
        //   handleCloseModal={onClose}
        />
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default AuthModal;
