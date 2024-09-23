import Image from "next/image";

import {
  GetCustomerAuctionItemsCustomerAuctionItemDTOCollection200,
  GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue,
} from "@/networking/sylius-api-client/.ts.schemas";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import HistoricalBids from "../DisplayProductHistory/HistoricalBids/HistoricalBids";
import styles from "./ProductVariantInHistoricalBids.module.scss";

type Props = {
  productVariants: GetCustomerAuctionItemsCustomerAuctionItemDTOCollection200 | undefined;
  isError: boolean;
  setSort: (sort: GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue) => void;
};

const ProductVariantInHistoricalBids = ({ productVariants, isError, setSort }: Props) => {
  const { t } = useTranslation("historique");

  if (isError) return <div>{t("common:common.errorOccurred")}</div>;

  if (!productVariants) return null;

  if (productVariants["hydra:totalItems"] === 0)
    return (
      <div className={styles.box}>
        <Image src="/cartons.jpg" alt="Hammer" width={125} height={125} />
        <div className={styles.message}>{t("neverMadeABid").toLocaleUpperCase()}</div>
      </div>
    );

  return <HistoricalBids productVariants={productVariants["hydra:member"]} setSort={setSort} />;
};

export const getStaticProps = getCommonPageStaticProps;

export default ProductVariantInHistoricalBids;
