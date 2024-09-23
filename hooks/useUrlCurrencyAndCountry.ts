import { useSessionStorageValue } from "@react-hookz/web";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { URL_CURRENCY_KEY, URL_DELIVERY_COUNTRY_KEY } from "@/utils/sessionStorageKeys";

export const useUrlCurrencyAndCountry = () => {
  const router = useRouter();

  const { set: setSessionStorageValue } = useSessionStorageValue<{
    currency?: string;
  }>(URL_CURRENCY_KEY, {
    initializeWithValue: false, // don't initialize on first render to avoid hydratation mismatch
  });
  const { set: setSessionStorageCountry } = useSessionStorageValue<{
    country?: string;
  }>(URL_DELIVERY_COUNTRY_KEY, {
    initializeWithValue: false, // don't initialize on first render to avoid hydratation mismatch
  });

  // if query params contain devise, force currency update
  useEffect(() => {
    const { devise, country } = router.query;
    if (typeof devise === "string") {
      setSessionStorageValue({ currency: devise });
    }
    if (typeof country === "string") {
      setSessionStorageCountry({ country });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, setSessionStorageValue, setSessionStorageCountry]);
};
