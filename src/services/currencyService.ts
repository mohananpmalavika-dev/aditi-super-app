/**
 * 100% Free Currency Exchange Rate Service
 * Powered by open Frankfurter API (European Central Bank data)
 * Zero API keys or authentication required.
 */

export interface CurrencyRateData {
  base: string;
  date: string;
  rates: Record<string, number>;
}

const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  INR: 86.5,
  GBP: 0.79,
  JPY: 152.4,
  CAD: 1.38,
  AUD: 1.54,
  SGD: 1.34,
  AED: 3.67
};

export async function fetchLiveExchangeRates(baseCurrency: string = 'USD'): Promise<CurrencyRateData> {
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
    if (!res.ok) throw new Error('Frankfurter API fetch failed');
    const data = await res.json();
    return {
      base: data.base,
      date: data.date,
      rates: { ...data.rates, [baseCurrency]: 1.0 }
    };
  } catch (e) {
    return {
      base: baseCurrency,
      date: new Date().toISOString().split('T')[0],
      rates: FALLBACK_RATES
    };
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  // Convert from origin to base (USD), then base to target
  const inBase = amount / fromRate;
  return inBase * toRate;
}
