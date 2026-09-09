/** Format paise (integer) as an INR string, e.g. 899900 -> "₹8,999". */
export function formatINR(paise: number): string {
  const rupees = Math.round(Number(paise) || 0) / 100;
  const whole = Number.isInteger(rupees);
  return (
    '₹' +
    rupees.toLocaleString('en-IN', {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

export type QuoteBreakdown = {
  destination: string;
  packageName: string;
  unit: string;
  duration?: string;
  perHead: boolean;
  perCouple?: boolean;
  adults: number;
  children: number;
  qty: number;
  unitPrice: number;
  baseAmount: number;
  coupon: { code: string; percent: number } | null;
  discountAmount: number;
  amount: number;
  currency: string;
};
