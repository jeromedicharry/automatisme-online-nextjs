export interface PaymentMethod {
  type: string;
  name: string;
  brands?: string[];
  configuration?: Record<string, any>;
}

export interface PaymentMethodsRequest {
  amount: number;
  currency: string;
  countryCode: string;
}

export interface PaymentMethodsResponse {
  paymentMethods: { paymentMethods: PaymentMethod[] };
}

export interface SessionRequest {
  amount: number;
  currency: string;
  reference: string;
  returnUrl: string;
}

export interface SessionResponse {
  id: string;
  sessionData: {
    amount: {
      currency: string;
      value: number;
    };
    channel: string;
    countryCode: string;
    expiresAt: string;
    id: string;
    merchantAccount: string;
    mode: string;
    reference: string;
    returnUrl: string;
    sessionData: string;
    shopperLocale: string;
  };
  clientKey: string;
}

export interface WebhookRequest {
  live: string;
  notificationItems: Array<{
    NotificationRequestItem: {
      amount: {
        currency: string;
        value: number;
      };
      eventCode: string;
      eventDate: string;
      merchantAccountCode: string;
      merchantReference: string;
      originalReference?: string;
      pspReference: string;
      reason?: string;
      success: string;
    };
  }>;
}

export interface NonceResponse {
  nonce: string;
}
