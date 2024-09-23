import Image from "next/image";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import SelectCustom from "@/components/atoms/Select";
import Popover from "@/components/molecules/Popover";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { useShopGetCurrencyCollection } from "@/networking/sylius-api-client/currency/currency";
import { HrefLangs } from "@/types/HrefLangs";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";

import styles from "./LanguageAndCurrencySelector.module.scss";
import LanguageSelector from "./LanguageSelector";

type SelectorProps = {
  isOnPLP?: boolean;
  hrefLangs?: HrefLangs;
};

const LanguageAndCurrencySelector = ({ isOnPLP = false, hrefLangs }: SelectorProps) => {
  const { t, lang } = useTranslation("common");
  const { data: currencies } = useShopGetCurrencyCollection({
    query: { staleTime: STALE_TIME_HOUR },
  });

  const { currentCurrency, setCurrentCurrency, updateUserCurrency } = useCurrentCurrency();
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      className={styles.dropdownMenuContent}
      trigger={
        <Button variant="inline">
          <Image
            priority
            src={`/flags/${lang}.svg`}
            alt={lang}
            width={25}
            height={25}
            className={styles.languageLogo}
          />
        </Button>
      }
    >
      <SelectCustom
        className={styles.currencyItem}
        value={currentCurrency}
        onValueChange={value => {
          setCurrentCurrency(value);
          setOpen(false);
          void updateUserCurrency(currencies, value);
        }}
        placeholder={currentCurrency}
        options={{
          groups: [
            {
              key: t("common.currency"),
              title: t("common.currency"),
              options:
                currencies?.map(currency => ({
                  value: currency.code,
                  label: currency.code,
                })) ?? [],
            },
          ],
        }}
      />
      <LanguageSelector isOnPLP={isOnPLP} hrefLangs={hrefLangs} setOpen={setOpen} />
    </Popover>
  );
};

export default LanguageAndCurrencySelector;
