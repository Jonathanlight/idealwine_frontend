import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { useQueryClient } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";

import SelectCustom from "@/components/atoms/Select";
import ShopPagination, { ITEMS_PER_PAGE } from "@/components/molecules/Pagination/ShopPagination";
import { AvailabilityAlertCard } from "@/components/organisms/AvailabilityAlertCard/AvailabilityAlertCard";
import TabsMenu from "@/components/organisms/TabsMenu";
import { ALERTS_TAB, AlertsTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import {
  getGetProductAvailabilityAlertCollectionQueryKey,
  useGetProductAvailabilityAlertCollection,
} from "@/networking/sylius-api-client/product-availability-alert/product-availability-alert";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { ImageFilters } from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

type sortKeys = "product-name" | "region" | "vintage" | "vintage-asc";

const sortOptions: Record<
  sortKeys,
  {
    value: sortKeys;
    label: `sort.${sortKeys}`;
    property: string;
    direction: "asc" | "desc";
  }
> = {
  "product-name": {
    value: "product-name",
    label: "sort.product-name",
    property: "product-name",
    direction: "asc",
  },
  region: {
    value: "region",
    label: "sort.region",
    property: "region",
    direction: "asc",
  },
  vintage: {
    value: "vintage",
    label: "sort.vintage",
    property: "vintage",
    direction: "desc",
  },
  "vintage-asc": {
    value: "vintage-asc",
    label: "sort.vintage-asc",
    property: "vintage",
    direction: "asc",
  },
} as const;

const Page = (): JSX.Element => {
  const { t } = useTranslation("alerts");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<sortKeys>("product-name");
  const queryClient = useQueryClient();
  const {
    data: availabilityAlerts,
    isFetching,
    isFetched,
  } = useGetProductAvailabilityAlertCollection(
    {
      [sortOptions[sort].property]: sortOptions[sort].direction,
      filter: [ImageFilters.ALERT],
      itemsPerPage: ITEMS_PER_PAGE,
      page: currentPage,
    },
    { query: { keepPreviousData: true } },
  );

  const onDeleteSuccess = () => {
    void queryClient.invalidateQueries({
      queryKey: getGetProductAvailabilityAlertCollectionQueryKey(),
    });
  };

  const totalItems = availabilityAlerts?.["hydra:totalItems"] ?? 0;

  useMountEffect(() => {
    sendGTMEvent({
      page: "consulter_alerte",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.consult.title")} description={t("seo.consult.description")} />
      <TabsMenu tabs={AlertsTabs} currentTab={ALERTS_TAB.MY_ALERTS_URL} activeTabIsTitle />

      <div className={styles.pageBlock}>
        {availabilityAlerts?.["hydra:member"].length === 0 && (
          <div className={styles.noAlerts}>
            <Image alt="Empty Warehouse" src="/warehouse.svg" width={200} height={200} />
            <div>{t("my-alerts.noAlerts")}</div>
          </div>
        )}

        <div className={styles.alertsList}>
          {availabilityAlerts?.["hydra:member"] === undefined ||
            (availabilityAlerts["hydra:member"].length > 0 && (
              <SelectCustom
                className={styles.select}
                value={sort}
                onValueChange={value => setSort(value as sortKeys)}
                options={{
                  groups: [
                    {
                      key: t("sort.by"),
                      title: t("sort.by"),
                      options: Object.entries(sortOptions).map(([value, option]) => ({
                        value,
                        label: t(option.label),
                      })),
                    },
                  ],
                }}
              />
            ))}

          {availabilityAlerts?.["hydra:member"].map(alert => (
            <AvailabilityAlertCard
              key={alert.id}
              availabilityAlert={alert}
              onDeleteSuccess={() => onDeleteSuccess()}
            />
          ))}

          {availabilityAlerts?.["hydra:member"] === undefined ||
            (availabilityAlerts["hydra:member"].length > 0 && (
              <ShopPagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                setCurrentPage={setCurrentPage}
                isLoading={isFetching && !isFetched}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
