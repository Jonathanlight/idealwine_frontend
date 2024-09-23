import { useLocalStorageValue, useSessionStorageValue } from "@react-hookz/web";
import { useCallback } from "react";

import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { CURRENT_DELIVERY_COUNTRY_KEY } from "@/utils/localStorageKeys";
import { URL_DELIVERY_COUNTRY_KEY } from "@/utils/sessionStorageKeys";

export const useCurrentDeliveryCountry = () => {
  const { value: localStorageCountry, set: setLocalStorageCountry } = useLocalStorageValue<{
    deliveryCountry?: string;
  }>(
    CURRENT_DELIVERY_COUNTRY_KEY,
    { defaultValue: { deliveryCountry: "FR" }, initializeWithValue: false },
    // don't initialize on first render to avoid hydratation mismatch
  );
  const { value: urlCountry } = useSessionStorageValue<{
    country?: string;
  }>(URL_DELIVERY_COUNTRY_KEY, {
    initializeWithValue: false, // don't initialize on first render to avoid hydratation mismatch
  });
  const { user } = useAuthenticatedUserContext();

  const country =
    urlCountry?.country ?? user?.countryCode ?? localStorageCountry?.deliveryCountry ?? "FR";

  const setCurrentDeliveryCountry = useCallback(
    (deliveryCountry: string) => setLocalStorageCountry({ deliveryCountry }),
    [setLocalStorageCountry],
  );

  return {
    currentDeliveryCountry: country,
    setCurrentDeliveryCountry,
  };
};
