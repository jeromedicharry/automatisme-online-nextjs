'use client';

import React, { useState, useEffect, useRef } from 'react';
import useWoocommerceAPI from '@/hooks/useWoocommerceAPI';
import { useAdyenAPI } from '@/hooks/useAdyenAPI';
import type { SessionResponse } from '@/types/adyen';
import AdyenCheckoutComponent from './AdyenCheckoutComponent';
import LoadingSpinner from '../atoms/LoadingSpinner';

interface CheckoutFormProps {
  onPaymentSuccess?: (session: any) => void;
  onPaymentError?: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { createPaymentSession } = useAdyenAPI();
  const { createOrder } = useWoocommerceAPI();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);
  const hasAttemptedOrderCreation = useRef(false);

  // Créer la commande WooCommerce
  useEffect(() => {
    const createWooOrder = async () => {
      if (hasAttemptedOrderCreation.current) return;
      hasAttemptedOrderCreation.current = true;

      try {
        setLoading(true);
        const newOrder = await createOrder();
        if (!newOrder) throw new Error('Erreur création commande WooCommerce');
        setOrder(newOrder);

        // Créer la session Adyen une fois la commande créée
        const session = await createPaymentSession({
          amount: Math.round(newOrder.order.total * 100),
          currency: newOrder.order.currency,
          reference: newOrder.adyen_reference,
          countryCode: 'FR',
          returnUrl: `${window.location.origin}/checkout/confirmation?order_id=${newOrder.order_id}`,
        });

        setSessionData(session);
      } catch (err: any) {
        console.error('Erreur création commande/session:', err);
        setError(err.message);
        onPaymentError?.(err.message);
      } finally {
        setLoading(false);
      }
    };

    createWooOrder();
  }, [createOrder, createPaymentSession, onPaymentError]);

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Réessayer</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <p className="mb-4 text-xl md:text-2xl text-center font-medium">
          Initialisation des moyens de paiement en cours...
        </p>
        <LoadingSpinner />
      </div>
    );
  }

  if (!order || !sessionData) {
    return null;
  }

  return (
    <AdyenCheckoutComponent
      order={order}
      sessionData={sessionData}
      onPaymentSuccess={onPaymentSuccess}
      onPaymentError={onPaymentError}
    />
  );
};

export default CheckoutForm;
