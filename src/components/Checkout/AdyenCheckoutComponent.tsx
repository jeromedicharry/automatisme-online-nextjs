'use client';

import React, { useEffect, useRef, useContext } from 'react';
import { CartContext } from '@/stores/CartProvider';
import { AdyenCheckout, Dropin } from '@adyen/adyen-web/auto';
import '@adyen/adyen-web/styles/adyen.css';
import type { SessionResponse } from '@/types/adyen';

interface AdyenCheckoutComponentProps {
  order: {
    order_id: string;
    order: {
      total: number;
      currency: string;
    };
    adyen_reference: string;
  };
  sessionData: SessionResponse;
  onPaymentSuccess?: (session: any) => void;
  onPaymentError?: (error: string) => void;
}

const AdyenCheckoutComponent: React.FC<AdyenCheckoutComponentProps> = ({
  order,
  sessionData,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const dropinContainerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<any>(null);
  const hasInitialized = useRef<boolean>(false);
  const { resyncFromLocalStorage } = useContext(CartContext);

  useEffect(() => {
    let mounted = true;

    const initAdyen = async () => {
      if (hasInitialized.current) {
        return;
      }
      hasInitialized.current = true;
      try {
        if (!dropinContainerRef.current) {
          throw new Error('Container Adyen non disponible');
        }

        const globalConfiguration: Parameters<typeof AdyenCheckout>[0] = {
          environment: 'test' as const,
          clientKey: process.env.ADYEN_CLIENT_KEY || '',
          session: sessionData.sessionData,
          locale: 'fr-FR',
          countryCode: 'FR',
          onPaymentCompleted: () => {
            if (!mounted) return;
            // On met la commande en processing car on attend la confirmation webhook
            window.location.href = `${window.location.origin}/checkout/confirmation?order_id=${order.order_id}&payment_status=success`;
          },
          onPaymentFailed: (result: any) => {
            if (!mounted) return;
            console.error('[Adyen] Paiement échoué:', result);
            // On met la commande en failed et on affiche un message d'erreur
            // Resynchroniser le panier depuis le localStorage
            resyncFromLocalStorage().then(() => {
              onPaymentError?.(
                result.message ||
                  'Le paiement a été refusé. Veuillez réessayer.',
              );
            });
          },
          onError: (error: any) => {
            if (!mounted) return;
            console.error('[Adyen] Erreur:', error);
            onPaymentError?.(error.message);
          },
        };

        const checkout = await AdyenCheckout(globalConfiguration);
        checkoutRef.current = checkout;

        if (mounted) {
          const dropinConfiguration = {
            onReady: () => {
              console.log('[AdyenCheckout] Drop-in prêt');
            },
            onSelect: (component: any) => {
              console.log(
                '[AdyenCheckout] Méthode sélectionnée:',
                component.props.name,
              );
            },
          };

          const dropin = new Dropin(checkout, dropinConfiguration);
          await dropin.mount(dropinContainerRef.current);
          checkoutRef.current = dropin;
        }
      } catch (err: any) {
        console.error('[AdyenCheckout] Erreur:', err);
        onPaymentError?.(err.message);
      }
    };

    initAdyen();

    return () => {
      mounted = false;
      hasInitialized.current = false;
      if (checkoutRef.current) {
        try {
          checkoutRef.current.unmount();
          checkoutRef.current = null;
        } catch (e) {
          console.error('[AdyenCheckout] Erreur démontage:', e);
        }
      }
    };
  }, [
    order,
    sessionData,
    onPaymentSuccess,
    onPaymentError,
    resyncFromLocalStorage,
  ]);

  return <div ref={dropinContainerRef} />;
};

export default AdyenCheckoutComponent;
