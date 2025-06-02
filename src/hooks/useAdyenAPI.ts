import { useState, useCallback } from 'react';
import type { PaymentMethodsResponse, SessionResponse } from '../types/adyen';

interface UseAdyenAPIReturn {
  getPaymentMethods: (
    amount: number,
    currency: string,
    countryCode: string,
  ) => Promise<PaymentMethodsResponse>;
  createPaymentSession: (data: {
    amount: number;
    currency: string;
    reference: string;
    countryCode: string;
    returnUrl: string;
  }) => Promise<SessionResponse>;
  loading: boolean;
  error: string | null;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export const useAdyenAPI = (): UseAdyenAPIReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getPaymentMethods = useCallback(
    async (
      amount: number,
      currency: string,
      countryCode: string,
    ): Promise<PaymentMethodsResponse> => {
      setLoading(true);
      setError(null);

      try {
        console.log('💰 Appel payment-methods:', { amount, currency, countryCode });

        const response = await fetch('/api/adyen/payment-methods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, currency, countryCode }),
        });

        const result: ApiResponse<PaymentMethodsResponse> = await response.json();

        if (!response.ok || result.error) {
          throw new Error(result.error || `Erreur HTTP: ${response.status}`);
        }

        if (!result.data) {
          throw new Error('Données manquantes dans la réponse');
        }

        console.log('✅ Réponse payment-methods:', result.data);
        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createPaymentSession = useCallback(
    async (data: {
      amount: number;
      currency: string;
      reference: string;
      returnUrl: string;
    }): Promise<SessionResponse> => {
      setLoading(true);
      setError(null);

      try {
        console.log('🔄 Création session Adyen...', data);

        const response = await fetch('/api/adyen/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: {
              currency: data.currency,
              value: Math.round(data.amount),
            },
            reference: data.reference,
            returnUrl: data.returnUrl,
          }),
        });

        const result: ApiResponse<SessionResponse> = await response.json();

        if (!response.ok || result.error) {
          throw new Error(result.error || `Erreur HTTP: ${response.status}`);
        }

        if (!result.data) {
          throw new Error('Données manquantes dans la réponse');
        }

        console.log('✅ Session Adyen créée:', result.data);
        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    getPaymentMethods,
    createPaymentSession,
    loading,
    error,
  };
};
