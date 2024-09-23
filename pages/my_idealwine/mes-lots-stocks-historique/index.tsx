import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import { useState } from "react";

import Input from "@/components/atoms/Input";
import ShopPagination, { ITEMS_PER_PAGE } from "@/components/molecules/Pagination/ShopPagination";
import TotalRecap from "@/components/molecules/TotalRecap/TotalRecap";
import { StockPageBreadcrumb } from "@/components/organisms/Breadcrumb/StockPageBreadcrumb";
import ProductVariantsInStock from "@/components/organisms/ProductVariantsInStock/ProductVariantsInStock";
import {
  ProductVariantStatus,
  statuses,
} from "@/components/organisms/ProductVariantsInStock/types";
import TabsMenu, { STOCK_TAB, StockTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useGetCustomerStoredItemsStoredItemDTOCollection } from "@/networking/sylius-api-client/stored-item-dt-o/stored-item-dt-o";
import { useGetTotalStoredItemDtoItem } from "@/networking/sylius-api-client/total-stored-item-dto/total-stored-item-dto";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuthenticatedUserContext();
  const [status, setStatus] = useState<ProductVariantStatus[]>(statuses);
  const [search, setSearchInput] = useState("");

  const { t } = useTranslation("lots-en-stock");

  const {
    data: productVariantInStockHistory,
    isFetching,
    isFetched,
    isError,
  } = useGetCustomerStoredItemsStoredItemDTOCollection(
    { status, itemsPerPage: ITEMS_PER_PAGE, page: currentPage, search: search },
    { query: { keepPreviousData: true } },
  );

  const { data: totalRecap, isError: isErrorRecap } = useGetTotalStoredItemDtoItem(
    user?.customerId ?? "",
    {
      status,
    },
  );

  const totalItems = productVariantInStockHistory?.["hydra:totalItems"] ?? 0;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchInput(e.currentTarget.value);
    }
  };

  useMountEffect(() => {
    sendGTMEvent({
      page: "mes-lots-stocks-historique",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo title={t("seo.history.title")} description={t("seo.history.description")} />
      <StockPageBreadcrumb translatedLinkName="MY_STORED_LOTS" stockTab={t("myStoredLots")} />

      <TabsMenu tabs={StockTabs} currentTab={STOCK_TAB.MY_STORED_LOTS_HISTORY} activeTabIsTitle />
      <div className={styles.pageBlock}>
        <div className={styles.board}>
          <div className={styles.search}>
            <Input
              name="textfield"
              placeholder={t("search")}
              type="text"
              onKeyUp={handleKeyPress}
            />
          </div>
          <ProductVariantsInStock
            storedItems={productVariantInStockHistory?.["hydra:member"]}
            isError={isError}
            isHistory={true}
            setStatus={setStatus}
            status={status}
          />
        </div>
      </div>
      <ShopPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        setCurrentPage={setCurrentPage}
        isLoading={isFetching && !isFetched}
      />
      {totalItems > 0 && isNotNullNorUndefined(totalRecap) && (
        <TotalRecap totalRecap={totalRecap} isErrorTotal={isErrorRecap} />
      )}
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
