// import client from '../apollo/ApolloClient';
// import { GET_TAX_RATES } from '../gql/WOOCOMMERCE_QUERIES';

export async function calculerPrix(
  prixHT: number,
  isProSession: boolean,
  // codePaysUtilisateur: string,
) {
  if (isProSession) {
    return prixHT; // Pas de TVA pour les sessions pro
  } else {
    return 'TOTO';
    // const tauxTVA = await getTauxTVA(codePaysUtilisateur);
    // if (tauxTVA) {
    //   const prixFinal = prixHT * (1 + tauxTVA / 100);
    //   return prixFinal;
    // } else {
    //   return null; // Gérer le cas où le taux de TVA n'est pas trouvé
    // }
  }
}

// async function getTauxTVA(codePays: string) {
//   try {
//     const response = await client.query({ query: GET_TAX_RATES });

//     const taxRates = response.data.taxRates.nodes;

//     const tauxPourPays = taxRates.find(
//       (rate: { country: string; rate: string }) => rate.country === codePays,
//     );
//     if (tauxPourPays) {
//       return parseFloat(tauxPourPays.rate);
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Erreur lors de la récupération des taux de TVA :', error);
//     return null;
//   }
// }
