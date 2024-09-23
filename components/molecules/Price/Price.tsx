import clsx from "clsx";

import { PriceProps } from "@/components/molecules/Price/PriceProps";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { CURRENCY_LOGOS, DB_SOURCE_CURRENCY } from "@/utils/constants";
import { centsToUnits } from "@/utils/formatHandler";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Price.module.scss";

const Price = ({
  price,
  size,
  isDiscount = false,
  isPrimeur = false,
  strikethrough = false,
  disabled = false,
  doNotConvertPrice = false,
  className,
  forcedCurrency,
  dontDisplayCents = false,
}: PriceProps) => {
  const { lang } = useTranslation();
  const { currentCurrencyLogo, getCurrencyLogo } = useCurrentCurrency();
  const { convertToActiveCurrency } = useCurrencyConverter();

  const { priceIsConvertible, convertedPrice: priceInActiveCurrency } =
    convertToActiveCurrency(price);

  const convertedPrice =
    forcedCurrency?.ratio !== undefined ? price * forcedCurrency.ratio : priceInActiveCurrency;
  const priceInUnits = centsToUnits(doNotConvertPrice ? price : convertedPrice);

  const [unitsOfPrice, centsOfPrice] = priceInUnits
    .toFixed(2)
    .split(".")
    .map(x => parseInt(x));

  const centsToDisplay = dontDisplayCents ? 0 : centsOfPrice;

  const forcedCurrencyLogo =
    forcedCurrency?.code !== undefined ? getCurrencyLogo(forcedCurrency.code) : null;
  const currencyLogo =
    forcedCurrencyLogo ??
    (priceIsConvertible && !doNotConvertPrice
      ? currentCurrencyLogo
      : CURRENCY_LOGOS[DB_SOURCE_CURRENCY]);

  const shouldLogoBeDisplayedBeforeUnits = lang === "en";

  return (
    <span
      className={clsx(
        styles[size],
        isDiscount && styles.discountPrice,
        isPrimeur && styles.primeurPrice,
        strikethrough && styles.strikethrough,
        disabled && styles.disabled,
        className,
      )}
    >
      <span className={styles.units}>
        {shouldLogoBeDisplayedBeforeUnits && currencyLogo}
        {(centsToDisplay !== 0 ? unitsOfPrice : Math.round(priceInUnits)).toLocaleString(lang)}
      </span>
      <sup className={styles.euroAndCents}>
        {shouldLogoBeDisplayedBeforeUnits ? " " : currencyLogo}
        {centsToDisplay !== 0 && centsToDisplay.toLocaleString(lang).padStart(2, "0")}
      </sup>
    </span>
  );
};

export default Price;
