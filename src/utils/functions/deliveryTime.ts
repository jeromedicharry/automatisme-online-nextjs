export function getProductAvailability({
  stock,
  backorders,
  restockingLeadTime,
}: {
  stock: number;
  backorders: 'YES' | 'NO';
  restockingLeadTime: number;
}): {
  deliveryLabel: string;
  isSellable: boolean;
} {
  if (backorders === 'YES') {
    if (stock > 0) {
      return {
        deliveryLabel: 'Expédié sous 1 à 2 JOURS',
        isSellable: true,
      };
    } else {
      const min = Math.max(restockingLeadTime - 2, 1);
      const max = restockingLeadTime;
      return {
        deliveryLabel: `Expédié sous ${min} à ${max} JOURS`,
        isSellable: true,
      };
    }
  } else {
    if (stock > 0) {
      return {
        deliveryLabel: 'Expédié sous 1 à 2 JOURS',
        isSellable: true,
      };
    } else {
      return {
        deliveryLabel: 'Produit actuellement indisponible',
        isSellable: false,
      };
    }
  }
}
