import clsx from "clsx";
import Image from "next/image";

import Button from "@/components/atoms/Button";
import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price";
import TooltipCustom from "@/components/molecules/Tooltip/Tooltip";
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
import styles from "./OngoingBids.module.scss";

type Props = {
  productVariants: CustomerAuctionItemDTOJsonldShopCustomerAuctionItemRead[];
  setSort: (sort: GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue) => void;
};

const OngoingBids = ({ productVariants, setSort }: Props) => {
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
                  <TooltipCustom
                    trigger={
                      <div
                        className={clsx(
                          productVariant.isWinning === true ? styles.greenCircle : styles.redCircle,
                        )}
                      />
                    }
                    contentProps={{ side: "bottom" }}
                  >
                    <span>
                      {productVariant.isWinning === true ? t("isWinning") : t("isLoosing")}
                    </span>
                  </TooltipCustom>
                </div>
                <div className={styles.subTitle}>
                  <div>
                    {t("endDate")} {getFormatDate(productVariant.auctionEndDate, "fr")}
                  </div>
                  <p className={styles.onDesktopAndTablet}>|</p>
                  <div>
                    {t("myOrder")}{" "}
                    {typeof productVariant.userBid === "number" && (
                      <Price price={productVariant.userBid} size="small" />
                    )}
                  </div>
                  <p className={styles.onDesktopAndTablet}>|</p>
                  <div>
                    {t("currentOrder")}{" "}
                    {typeof productVariant.highestBid === "number" && (
                      <Price price={productVariant.highestBid} size="small" />
                    )}
                  </div>{" "}
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

export default OngoingBids;
