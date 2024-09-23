import clsx from "clsx";

import Price from "@/components/molecules/Price/Price";
import { PriceProps } from "@/components/molecules/Price/PriceProps";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";

import styles from "./OrderPrice.module.scss";

type Props = PriceProps & {
  displayAsRow?: boolean;
};

const OrderPrice = ({ displayAsRow, ...priceProps }: Props) => {
  const { currentCurrency } = useCurrentCurrency();
  const showConvertedPrice = "EUR" !== currentCurrency;

  return (
    <div
      className={clsx(styles.container, {
        [styles.displayAsRow]: displayAsRow,
      })}
    >
      <Price {...priceProps} size="small" />
      {showConvertedPrice && (
        <span>
          (
          <Price {...priceProps} size="small" doNotConvertPrice />)
        </span>
      )}
    </div>
  );
};

export default OrderPrice;
