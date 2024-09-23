import clsx from "clsx";
import Image from "next/image";

import Button from "@/components/atoms/Button";
import PdpLink from "@/components/molecules/PdpLink";
import OrderPrice from "@/components/molecules/Price/OrderPrice";
import NumberOfBottlesWithFormat from "@/components/organisms/NumberOfBottlesWithFormat";
import {
  CustomerAuctionItemDTOJsonldShopCustomerAuctionItemRead,
  GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue,
} from "@/networking/sylius-api-client/.ts.schemas";
import { getFormatDate } from "@/utils/datesHandler";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { getCustomerProductVariantImagePath } from "@/utils/productVariantImage";

import SelectSortBids from "../SelectSortBids/SelectSortBids";
import styles from "./HistoricalBids.module.scss";

type Props = {
  productVariants: CustomerAuctionItemDTOJsonldShopCustomerAuctionItemRead[];
  setSort: (sort: GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue) => void;
};

const HistoricalBids = ({ productVariants, setSort }: Props) => {
  const { t, lang } = useTranslation("historique");

  return (
    <div className={styles.selectAndProducts}>
      <SelectSortBids setSort={setSort} className={styles.historicSort} />
      <div className={styles.box}>
        {productVariants.map(
          (productVariant: CustomerAuctionItemDTOJsonldShopCustomerAuctionItemRead) => (
            <div key={productVariant.id} className={styles.rectangle}>
              <Image
                unoptimized
                className={styles.image}
                src={getCustomerProductVariantImagePath(lang, productVariant.productVariantImage)}
                alt={productVariant.name ?? t("wineBottle")}
                width={80}
                height={80}
              />

              <div className={styles.infos}>
                <div className={styles.title}>
                  <NumberOfBottlesWithFormat variant={productVariant} /> {productVariant.name}
                </div>
                <div className={styles.bidInfoContainer}>
                  <div className={styles.bidInfoSection}>
                    {t("endDate")} {getFormatDate(productVariant.auctionEndDate, "fr")}
                  </div>
                  <div className={clsx(styles.bidInfo, styles.bidInfoSection)}>
                    {t("obtained")} :{" "}
                    <div className={styles.isObtainedValue}>
                      {t(`isObtained.${productVariant.isWinning === true}`)}
                    </div>
                  </div>
                  <div className={clsx(styles.bidInfo, styles.bidInfoSection)}>
                    {t("myOrder")}{" "}
                    {typeof productVariant.userBid === "number" && (
                      <OrderPrice price={productVariant.userBid} size="small" displayAsRow />
                    )}
                  </div>
                  <div className={clsx(styles.bidInfo, styles.bidInfoSection)}>
                    {t("finalPrice")}{" "}
                    {typeof productVariant.highestBid === "number" && (
                      <OrderPrice displayAsRow price={productVariant.highestBid} size="small" />
                    )}
                  </div>
                  <div className={styles.bidInfoSection}>
                    {t("gap")}: {productVariant.gap}%
                  </div>
                  <div className={clsx(styles.bidInfo, styles.bidInfoSection)}>
                    {t("estimate")}:{" "}
                    {typeof productVariant.estimate === "number" && (
                      <OrderPrice displayAsRow price={productVariant.estimate} size="small" />
                    )}
                  </div>
                </div>
              </div>
              <PdpLink variant={productVariant}>
                <Button className={styles.button} variant="primaryBlack">
                  {t("see")}
                </Button>
              </PdpLink>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default HistoricalBids;
