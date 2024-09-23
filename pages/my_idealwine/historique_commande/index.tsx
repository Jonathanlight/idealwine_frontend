import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import { useState } from "react";

import HistoricalOrderSection from "@/components/molecules/HistoricalOrderSection";
import ShopPagination, { ITEMS_PER_PAGE } from "@/components/molecules/Pagination/ShopPagination";
import { HistoryBreadcrumb } from "@/components/organisms/Breadcrumb/HistoryBreadcrumb";
import { ShippingMethodJsonldShopOrderReadCode } from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetOrderCollection } from "@/networking/sylius-api-client/order/order";
import ClientOnly from "@/utils/ClientOnly";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation("historique");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: paidAndNonGroupedOrders,
    isFetching,
    isFetched,
  } = useShopGetOrderCollection(
    {
      excluded_shipping_methods: [
        ShippingMethodJsonldShopOrderReadCode["WORLD-SHIPPING-GROUPMENT"],
        ShippingMethodJsonldShopOrderReadCode["NO-SHIPPING-NEEDED"],
      ],
      itemsPerPage: ITEMS_PER_PAGE,
      page: currentPage,
      isActiveState: "true",
      "order[checkoutCompletedAt]": "desc",
    },
    { query: { keepPreviousData: true } },
  );

  const totalItems = paidAndNonGroupedOrders?.["hydra:totalItems"] ?? 0;

  useMountEffect(() => {
    sendGTMEvent({
      page: "historique_commande",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo
        title={t("seo.orderHistory.title")}
        description={t("seo.orderHistory.description")}
      />
      <HistoryBreadcrumb translatedLinkName="BUY_HISTORY" historyTab={t("orderHistoryTab")} />
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>{t("orderHistory.title")} </h1>
        <ClientOnly>
          {paidAndNonGroupedOrders?.["hydra:member"].map(order => (
            <HistoricalOrderSection {...order} key={order.number?.toString()} />
          ))}
        </ClientOnly>
      </div>
      <ShopPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        setCurrentPage={setCurrentPage}
        isLoading={isFetching && !isFetched}
      />
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
