import client from '../apollo/ApolloClient';
import { GET_TAX_RATES } from '../gql/WOOCOMMERCE_QUERIES';

export async function calculerPrix(
  prixHT: number,
  isProSession: boolean,
  countryCode: string,
): Promise<number> {
  if (isProSession) {
    return Math.round(prixHT * 100) / 100; // Pas de TVA pour les sessions pro
  } else {
    const tauxTVA = (await getTauxTVA(countryCode)) || 20;

    const prixFinal = prixHT * (1 + tauxTVA / 100);

    return Math.round(prixFinal * 100) / 100;
  }
}

async function getTauxTVA(countryCode: string) {
  try {
    const response = await client.query({ query: GET_TAX_RATES });

    const taxRates = response?.data?.taxRates?.nodes || [];

    const tauxPourPays = taxRates.find(
      (rate: { country: string; rate: string }) => rate.country === countryCode,
    );
    if (tauxPourPays) {
      return parseFloat(tauxPourPays.rate);
    } else {
      return 20;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des taux de TVA :', error);
    return 20;
  }
}
