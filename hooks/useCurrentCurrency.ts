import { useLocalStorageValue, useSessionStorageValue } from "@react-hookz/web";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useSendRefreshTokenRequest } from "@/networking/mutator/axios-hooks";
import { CurrencyShopCurrencyRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useShopPutCustomerItem } from "@/networking/sylius-api-client/customer/customer";
import { CURRENCY_LOGOS, DB_SOURCE_CURRENCY } from "@/utils/constants";
import { getCurrencyIRI } from "@/utils/iriUtils";
import { CURRENT_CURRENCY_KEY } from "@/utils/localStorageKeys";
import { useTranslation } from "@/utils/next-utils";
import { URL_CURRENCY_KEY } from "@/utils/sessionStorageKeys";
import { isNonEmptyString } from "@/utils/ts-utils";

export const useCurrentCurrency = () => {
  const { user } = useAuthenticatedUserContext();
  const { mutateAsync: putCustomer } = useShopPutCustomerItem();
  const { sendRefreshTokenRequest } = useSendRefreshTokenRequest();
  const { t } = useTranslation("common");

  const { value: sessionStorageValue } = useSessionStorageValue<{
    currency?: string;
  }>(URL_CURRENCY_KEY, {
    initializeWithValue: false, // don't initialize on first render to avoid hydratation mismatch
  });

  // get currency fallback value from localStorage
  const { value: localStorageValue, set: setLocalStorageValue } = useLocalStorageValue<{
    currency?: string;
  }>(CURRENT_CURRENCY_KEY, {
    defaultValue: { currency: DB_SOURCE_CURRENCY },
    initializeWithValue: false, // don't initialize on first render to avoid hydratation mismatch
  });

  const setCurrentCurrency = useCallback(
    (currency: string) => setLocalStorageValue({ currency }),
    [setLocalStorageValue],
  );

  // if user is connected, update currency value
  useEffect(() => {
    if (
      !isNonEmptyString(sessionStorageValue?.currency) &&
      typeof user?.currencyCode === "string" &&
      localStorageValue?.currency !== user.currencyCode
    ) {
      setCurrentCurrency(user.currencyCode);
    }
  }, [user, localStorageValue, setCurrentCurrency, sessionStorageValue?.currency]);

  const updateUserCurrency = async (
    currencies: CurrencyShopCurrencyRead[] | undefined,
    newCurrencyCode: string,
  ) => {
    const currency = currencies?.find(element => {
      return element.code === newCurrencyCode;
    });
    if (user && currency) {
      try {
        await putCustomer({
          id: user.customerId,
          data: { currency: getCurrencyIRI(currency.code) },
        });
        setCurrentCurrency(currency.code);
        await sendRefreshTokenRequest();
        toast.success<string>(t("header.currencySelector.currencyUpdated"));
      } catch (err) {
        toast.error<string>(t("header.currencySelector.errorUpdatingCurrency"));
      }
    }
  };

  const getCurrencyLogo = (currencyCode: string) =>
    currencyCode in CURRENCY_LOGOS
      ? CURRENCY_LOGOS[currencyCode as keyof typeof CURRENCY_LOGOS]
      : currencyCode;

  const currentCurrency =
    sessionStorageValue?.currency ?? localStorageValue?.currency ?? DB_SOURCE_CURRENCY;

  return {
    currentCurrency,
    currentCurrencyLogo: getCurrencyLogo(currentCurrency),
    setCurrentCurrency,
    updateUserCurrency,
    getCurrencyLogo,
  };
};
