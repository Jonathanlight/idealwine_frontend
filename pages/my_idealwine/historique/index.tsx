import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { useState } from "react";

import ShopPagination, { ITEMS_PER_PAGE } from "@/components/molecules/Pagination/ShopPagination";
import { HistoryBreadcrumb } from "@/components/organisms/Breadcrumb/HistoryBreadcrumb";
import ProductVariantInHistoricalDirectPurchases from "@/components/organisms/Historic/ProductVariantInHistoricalDirectPurchases/ProductVariantInHistoricalDirectPurchases";
import TabsMenu from "@/components/organisms/TabsMenu";
import { HISTORY_TAB, HistoryTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import { useShopGetCustomerOrderItemsOrderItemCollection } from "@/networking/sylius-api-client/order-item/order-item";
import { ORDER_PAYMENT_STATES } from "@/utils/constants";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { ImageFilters } from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation("historique");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: orderItems,
    isFetching,
    isFetched,
    isError,
  } = useShopGetCustomerOrderItemsOrderItemCollection(
    {
      filter: [ImageFilters.CUSTOMER],
      "variant.auction": "false",
      "order.paymentState": [
        ORDER_PAYMENT_STATES.PAID,
        ORDER_PAYMENT_STATES.STATE_AWAITING_PAYMENT,
      ],
      itemsPerPage: ITEMS_PER_PAGE,
      page: currentPage,
      "orderItem[order.checkoutCompletedAt]": "desc",
    },
    { query: { keepPreviousData: true } },
  );

  const totalItems = orderItems?.["hydra:totalItems"] ?? 0;

  useMountEffect(() => {
    sendGTMEvent({
      page: "historique",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <HistoryBreadcrumb translatedLinkName="BUY_HISTORY" historyTab={t("buyHistory")} />
      <TabsMenu tabs={HistoryTabs} currentTab={HISTORY_TAB.BUY_HISTORY} activeTabIsTitle />

      <div className={styles.historicPageBlock}>
        <ProductVariantInHistoricalDirectPurchases orderItems={orderItems} isError={isError} />
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
