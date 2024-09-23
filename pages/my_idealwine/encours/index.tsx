import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import { useState } from "react";

import ShopPagination, { ITEMS_PER_PAGE } from "@/components/molecules/Pagination/ShopPagination";
import { HistoryBreadcrumb } from "@/components/organisms/Breadcrumb/HistoryBreadcrumb";
import ProductVariantInOngoingBids from "@/components/organisms/Historic/ProductVariantInOngoingBids/ProductVariantInOngoingBids";
import TabsMenu from "@/components/organisms/TabsMenu";
import { HISTORY_TAB, HistoryTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import { GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue } from "@/networking/sylius-api-client/.ts.schemas";
import { useGetCustomerAuctionItemsCustomerAuctionItemDTOCollection } from "@/networking/sylius-api-client/customer-auction-item-dt-o/customer-auction-item-dt-o";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation("historique");

  const [sort, setSort] =
    useState<GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue>(
      GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue.AUCTION_END_DATE_DESC,
    );

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: productVariantInOngoingBids,
    isFetching,
    isFetched,
    isError,
  } = useGetCustomerAuctionItemsCustomerAuctionItemDTOCollection(
    {
      filter: ["product_variant_x_small"],
      sortValue: sort,
      ongoing: true,
      itemsPerPage: ITEMS_PER_PAGE,
      page: currentPage,
    },
    { query: { keepPreviousData: true } },
  );

  const totalItems = productVariantInOngoingBids?.["hydra:totalItems"] ?? 0;

  useMountEffect(() => {
    sendGTMEvent({
      page: "encours",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo title={t("seo.ongoingBids.title")} description={t("seo.ongoingBids.description")} />
      <HistoryBreadcrumb translatedLinkName="ONGOING_BIDS" historyTab={t("ongoingBids")} />
      <TabsMenu tabs={HistoryTabs} currentTab={HISTORY_TAB.ONGOING_BIDS} activeTabIsTitle />

      <div className={styles.historicPageBlock}>
        <ProductVariantInOngoingBids
          productVariants={productVariantInOngoingBids}
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
