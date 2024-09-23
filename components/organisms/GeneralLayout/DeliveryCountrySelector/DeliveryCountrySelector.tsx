import clsx from "clsx";
import { useMemo } from "react";

import SelectCustom from "@/components/atoms/Select";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";
import { isNullOrUndefined } from "@/utils/ts-utils";

import styles from "./DeliveryCountrySelector.module.scss";

const DeliveryCountrySelector = () => {
  const { t } = useTranslation("common");
  const { data: enabledCountries } = useShopGetCountryCollection(
    { enabled: true },
    { query: { staleTime: STALE_TIME_HOUR } },
  );
  const { user, numberOfNonPaidOrders } = useAuthenticatedUserContext();

  const { currentDeliveryCountry: countryValue, setCurrentDeliveryCountry } =
    useCurrentDeliveryCountry();

  const countryLabelByCode = useMemo(() => {
    if (isNullOrUndefined(enabledCountries)) return {};

    return enabledCountries.reduce<Record<string, string>>((acc, country) => {
      acc[country.code] = country.name ?? "";

      return acc;
    }, {});
  }, [enabledCountries]);

  const options =
    enabledCountries
      ?.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
      .map(country => ({ value: country.code, label: country.name ?? "" })) ?? [];

  return (
    <div className={styles.deliveryCountry}>
      {t("header.delivery")}{" "}
      {user ? (
        <span className={styles.golden}>{countryLabelByCode[countryValue]}</span>
      ) : (
        <SelectCustom
          className={styles.golden}
          value={countryValue}
          onValueChange={setCurrentDeliveryCountry}
          placeholder={countryValue}
          triggerClassName={styles.triggerClassName}
          options={{
            groups: [
              {
                key: t("header.deliveryCountry"),
                title: t("header.deliveryCountry"),
                options: options,
              },
            ],
          }}
        />
      )}
      {user && numberOfNonPaidOrders > 0 && (
        <>
          <span className={clsx(styles.split, styles.dontShowOnMobile)}>|</span>
          <span>
            {t("header.firstUnpaidCommand")}{" "}
            <TranslatableLink href="BASKET_URL" className={styles.golden}>
              {t("header.secondUnpaidCommand", { count: numberOfNonPaidOrders })}
            </TranslatableLink>
          </span>
        </>
      )}
    </div>
  );
};

export default DeliveryCountrySelector;
