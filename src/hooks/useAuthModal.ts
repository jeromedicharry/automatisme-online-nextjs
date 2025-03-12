// hooks/useAuthModal.ts
import { useState, useEffect, useCallback } from 'react';
import useAuth from '@/hooks/useAuth';

export type FormStatusProps = 'login' | 'register' | 'reset';

export default function useAuthModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatusProps>('login');
  const { loggedIn, loading, user } = useAuth();

  useEffect(() => {
    if (loggedIn) {
      setIsModalOpen(false);
    }
  }, [loggedIn]);

  const openModal = useCallback((initialForm: FormStatusProps = 'login') => {
    setFormStatus(initialForm);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    formStatus,
    setFormStatus,
    openModal,
    closeModal,
    loggedIn,
    loading,
    user,
  };
}
