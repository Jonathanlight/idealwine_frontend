import { useMemo } from "react";

import { AuthenticatedUser } from "@/context/AuthenticatedUserContext";
import {
  CountryShopCountryRead,
  ProvinceJsonldShopCountryRead,
} from "@/networking/sylius-api-client/.ts.schemas";

import { isNullOrUndefined } from "./ts-utils";

export const getCountryCode = (user?: AuthenticatedUser | null, currentDeliveryCountry?: string) =>
  isNullOrUndefined(user) ? currentDeliveryCountry ?? "FR" : user.countryCode ?? "FR";

export const isCountryCodeInUnitedKingdom = (countryCode: string) =>
  countryCode === "UK" || countryCode === "GB";

type CountriesProvincesMapping = {
  [countryCode: string]: ProvinceJsonldShopCountryRead[] | undefined;
};

export const useCountriesProvincesMapping = (countries?: CountryShopCountryRead[]) =>
  useMemo(
    () =>
      countries?.reduce((partialCountriesProvincesMapping, { code, provinces }) => {
        partialCountriesProvincesMapping[code] = provinces;

        return partialCountriesProvincesMapping;
      }, {} as CountriesProvincesMapping) ?? {},
    [countries],
  );
