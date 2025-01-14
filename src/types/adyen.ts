export interface AdyenSessionData {
  sessionData: string;
  sessionId: string;
  amount: {
    currency: string;
    value: number;
  };
  reference: string;
}
