import client from '../apollo/ApolloClient';
import { GET_TAX_RATES } from '../gql/WOOCOMMERCE_QUERIES';

export async function calculerPrix(
  prixHT: number,
  isProSession: boolean | undefined,
  countryCode: string,
  hasProDiscount?: boolean,
  discountRate?: number,
): Promise<number> {
  // Si isPro est undefined, on retourne le prix TTC
  if (isProSession === undefined) {
    return Math.round(prixHT * 100) / 100;
  }

  // Si c'est un client pro
  if (isProSession === true) {
    // S'il y a une réduction pro, on l'applique sur le prix HT
    if (hasProDiscount && discountRate) {
      const prixReduit = prixHT * (1 - discountRate / 100);
      return Math.round(prixReduit * 100) / 100;
    }
    // Sinon on retourne le prix HT normal
    return Math.round(prixHT * 100) / 100;
  }

  // Si isPro est false, on calcule le prix TTC
  const tauxTVA = (await getTauxTVA(countryCode)) || 20;
  const prixFinal = prixHT * (1 + tauxTVA / 100);
  return Math.round(prixFinal * 100) / 100;
}

export async function getTauxTVA(countryCode: string) {
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
