import { faCircleExclamation } from "@fortawesome/pro-light-svg-icons/faCircleExclamation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import { useState } from "react";

import LinkButton from "@/components/atoms/Button/LinkButton";
import SelectCustom from "@/components/atoms/Select";
import { AuctionAlertCard } from "@/components/organisms/AuctionAlertCard/AuctionAlertCard";
import TabsMenu from "@/components/organisms/TabsMenu";
import { ALERTS_TAB, AlertsTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { PLPIndexName } from "@/hooks/useAlgoliaRefinements";
import { AuctionAlertJsonldShopAuctionAlertRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useGetAuctionAlertCollection } from "@/networking/sylius-api-client/auction-alert/auction-alert";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { ImageFilters } from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

type sortKeys =
  | "vintage"
  | "vintage-asc"
  | "estimation"
  | "estimation-asc"
  | "endDate"
  | "endDate-asc";

const sortOptions: Record<
  sortKeys,
  {
    value: sortKeys;
    label: `sort.${sortKeys}`;
    sortFunc: (
      a: AuctionAlertJsonldShopAuctionAlertRead,
      b: AuctionAlertJsonldShopAuctionAlertRead,
    ) => number;
  }
> = {
  vintage: {
    value: "vintage",
    label: "sort.vintage",
    sortFunc: (a, b) =>
      (b.productVariantInAuctionCatalog?.productVariant?.productVintage?.year ?? 0) -
      (a.productVariantInAuctionCatalog?.productVariant?.productVintage?.year ?? 0),
  },
  "vintage-asc": {
    value: "vintage-asc",
    label: "sort.vintage-asc",
    sortFunc: (a, b) =>
      (a.productVariantInAuctionCatalog?.productVariant?.productVintage?.year ?? 0) -
      (b.productVariantInAuctionCatalog?.productVariant?.productVintage?.year ?? 0),
  },
  estimation: {
    value: "estimation",
    label: "sort.estimation",
    sortFunc: (a, b) =>
      (b.productVariantInAuctionCatalog?.productVariant?.averageEstimate ?? 0) -
      (a.productVariantInAuctionCatalog?.productVariant?.averageEstimate ?? 0),
  },
  "estimation-asc": {
    value: "estimation-asc",
    label: "sort.estimation-asc",
    sortFunc: (a, b) =>
      (a.productVariantInAuctionCatalog?.productVariant?.averageEstimate ?? 0) -
      (b.productVariantInAuctionCatalog?.productVariant?.averageEstimate ?? 0),
  },
  endDate: {
    value: "endDate",
    label: "sort.endDate",
    sortFunc: (a, b) =>
      new Date(a.productVariantInAuctionCatalog?.auctionCatalog?.endDate ?? "").getTime() -
      new Date(b.productVariantInAuctionCatalog?.auctionCatalog?.endDate ?? "").getTime(),
  },
  "endDate-asc": {
    value: "endDate-asc",
    label: "sort.endDate-asc",
    sortFunc: (a, b) =>
      new Date(b.productVariantInAuctionCatalog?.auctionCatalog?.endDate ?? "").getTime() -
      new Date(a.productVariantInAuctionCatalog?.auctionCatalog?.endDate ?? "").getTime(),
  },
} as const;

const Page = (): JSX.Element => {
  const {
    data: auctionAlerts,
    isError,
    isLoading,
  } = useGetAuctionAlertCollection({ filter: [ImageFilters.ALERT] });
  const { t, lang } = useTranslation("alerts");
  const [sort, setSort] = useState<sortKeys>("endDate");

  useMountEffect(() => {
    sendGTMEvent({
      page: "surveiller",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.consult.title")} description={t("seo.consult.description")} />
      <TabsMenu tabs={AlertsTabs} currentTab={ALERTS_TAB.WATCHLIST_URL} activeTabIsTitle />
      <div>
        <div className={styles.auctionAlertList}>
          {auctionAlerts?.["hydra:member"] === undefined ||
            (auctionAlerts["hydra:member"].length > 0 && (
              <SelectCustom
                className={styles.select}
                value={sort}
                onValueChange={value => setSort(value as sortKeys)}
                options={{
                  groups: [
                    {
                      key: t("sort.by"),
                      title: t("sort.by"),
                      options: Object.entries(sortOptions).map(([, option]) => ({
                        value: option.value,
                        label: t(option.label),
                      })),
                    },
                  ],
                }}
              />
            ))}

          {isLoading && t("common:common.isLoading")}
          {isError && t("common:common.errorOccurred")}
          {auctionAlerts?.["hydra:member"].length === 0 && (
            <div className={styles.noAlerts}>
              <div className={styles.icons}>
                <FontAwesomeIcon icon={faCircleExclamation} />
                {t("common:common.0LotWatched")}
              </div>

              <LinkButton
                href={getPlpUrl(
                  { isDirectPurchase: ["false"], sortBy: [`${PLPIndexName}_price_desc`] },
                  lang,
                )}
                variant="primaryBlack"
                dontTranslate
              >
                {t("common:common.SeeCurrentAuctions")}
              </LinkButton>
            </div>
          )}

          {auctionAlerts?.["hydra:member"].sort(sortOptions[sort].sortFunc).map(auctionAlert => (
            <AuctionAlertCard key={auctionAlert["@id"]} auctionAlert={auctionAlert} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
