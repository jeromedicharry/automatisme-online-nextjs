export function calculateTTC(priceHT: number, tvaRate: number = 20): number {
  return Number((priceHT * (1 + tvaRate / 100)).toFixed(2));
}
