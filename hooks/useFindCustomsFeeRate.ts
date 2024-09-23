import { useMemo } from "react";

import { useGetCustomsFeeRateCollection } from "@/networking/sylius-api-client/customs-fee-rate/customs-fee-rate";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { isNullOrUndefined } from "@/utils/ts-utils";

export const useFindCustomsFeeRate = (countryCode: string) => {
  const { data: customsFeeRateCollection } = useGetCustomsFeeRateCollection({
    query: { staleTime: STALE_TIME_HOUR },
  });

  // Find the customs fee rate for the given country code
  const customsFeeRate = useMemo(() => {
    if (isNullOrUndefined(customsFeeRateCollection)) return undefined;

    return customsFeeRateCollection.find(
      customsFeeRateReceived => customsFeeRateReceived.country?.code === countryCode,
    );
  }, [customsFeeRateCollection, countryCode]);

  return customsFeeRate;
};
