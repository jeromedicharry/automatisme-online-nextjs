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
  if (stock > 0) {
    return {
      deliveryLabel: 'Expédié sous 1 à 2 JOURS',
      isSellable: true,
    };
  }

  if (backorders === 'YES') {
    const leadingTime = restockingLeadTime || 20;
    const min = Math.max(leadingTime - 2, 1);
    const max = leadingTime;
    return {
      deliveryLabel: `Expédié sous ${min} à ${max} JOURS`,
      isSellable: true,
    };
  }

  return {
    deliveryLabel: 'Produit actuellement indisponible',
    isSellable: false,
  };
}
