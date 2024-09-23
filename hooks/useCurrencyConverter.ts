import { useMemo } from "react";

import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { useShopGetExchangeRateCollection } from "@/networking/sylius-api-client/exchange-rate/exchange-rate";
import { DB_SOURCE_CURRENCY, STALE_TIME_HOUR } from "@/utils/constants";

export const useCurrencyConverter = () => {
  const { currentCurrency } = useCurrentCurrency();
  const { data: exchangeRates } = useShopGetExchangeRateCollection({
    query: { staleTime: STALE_TIME_HOUR },
  });

  const exchangeRatesByCurrency = useMemo(() => {
    return (exchangeRates ?? []).reduce<Record<string, Record<string, number>>>(
      (acc, exchangeRate) => {
        const { sourceCurrency, targetCurrency, ratio } = exchangeRate;

        if (!(sourceCurrency.code in acc)) acc[sourceCurrency.code] = {};
        if (!(targetCurrency.code in acc)) acc[targetCurrency.code] = {};

        acc[sourceCurrency.code][targetCurrency.code] = parseFloat(ratio);
        acc[targetCurrency.code][sourceCurrency.code] = 1 / parseFloat(ratio);

        return acc;
      },
      {},
    );
  }, [exchangeRates]);

  const convertCurrency = (price: number, sourceCurrency: string, targetCurrency: string) => {
    const priceIsConvertible =
      sourceCurrency in exchangeRatesByCurrency &&
      targetCurrency in exchangeRatesByCurrency[sourceCurrency];

    const convertedPrice = priceIsConvertible
      ? price * exchangeRatesByCurrency[sourceCurrency][targetCurrency]
      : price;

    return { priceIsConvertible, convertedPrice };
  };

  const convertToActiveCurrency = (price: number) =>
    convertCurrency(price, DB_SOURCE_CURRENCY, currentCurrency);

  const convertFromActiveCurrency = (price: number) =>
    convertCurrency(price, currentCurrency, DB_SOURCE_CURRENCY);

  return { convertCurrency, convertToActiveCurrency, convertFromActiveCurrency };
};
