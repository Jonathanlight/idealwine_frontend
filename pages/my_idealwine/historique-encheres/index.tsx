import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import { useState } from "react";

import ShopPagination, { ITEMS_PER_PAGE } from "@/components/molecules/Pagination/ShopPagination";
import { HistoryBreadcrumb } from "@/components/organisms/Breadcrumb/HistoryBreadcrumb";
import ProductVariantInHistoricalBids from "@/components/organisms/Historic/ProductVariantInHistoricalBids/ProductVariantInHistoricalBids";
import TabsMenu from "@/components/organisms/TabsMenu";
import { HISTORY_TAB, HistoryTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import { GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue } from "@/networking/sylius-api-client/.ts.schemas";
import { useGetCustomerAuctionItemsCustomerAuctionItemDTOCollection } from "@/networking/sylius-api-client/customer-auction-item-dt-o/customer-auction-item-dt-o";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation("historique");

  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] =
    useState<GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue>(
      GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue.AUCTION_END_DATE_DESC,
    );

  const {
    data: productVariantsInHistoricalBids,
    isFetching,
    isFetched,
    isError,
  } = useGetCustomerAuctionItemsCustomerAuctionItemDTOCollection(
    {
      filter: ["product_variant_x_small"],
      sortValue: sort,
      ongoing: false,
      itemsPerPage: ITEMS_PER_PAGE,
      page: currentPage,
    },
    { query: { keepPreviousData: true } },
  );

  const totalItems = productVariantsInHistoricalBids?.["hydra:totalItems"] ?? 0;

  useMountEffect(() => {
    sendGTMEvent({
      page: "historique-encheres",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo
        title={t("seo.purchaseHistory.title")}
        description={t("seo.purchaseHistory.description")}
      />
      <HistoryBreadcrumb translatedLinkName="BIDS_HISTORY" historyTab={t("bidsHistory")} />
      <TabsMenu tabs={HistoryTabs} currentTab={HISTORY_TAB.BIDS_HISTORY} activeTabIsTitle />

      <div className={styles.historicPageBlock}>
        <ProductVariantInHistoricalBids
          productVariants={productVariantsInHistoricalBids}
          isError={isError}
          setSort={setSort}
        />
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
