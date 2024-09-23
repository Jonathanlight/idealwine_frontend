import Price from "@/components/molecules/Price/Price";
import { useTranslation } from "@/utils/next-utils";

import styles from "./GroupedOrderRecapLine.module.scss";

type Props = {
  date: string;
  price: number;
  isAuction: boolean;
};

const GroupedOrderRecapLine = ({ date, price, isAuction }: Props) => {
  const { t } = useTranslation("checkout-common");
  const title = t(isAuction ? "auctionAt" : "directPurchaseAt", { date: date });

  return (
    <>
      <span className={styles.title}>{title}</span>
      <Price price={price} size="small" />
    </>
  );
};

export default GroupedOrderRecapLine;
