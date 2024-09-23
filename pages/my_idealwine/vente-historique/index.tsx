import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import Image from "next/image";
import React, { useState } from "react";

import DatePicker from "@/components/molecules/DatePicker/DatePicker";
import ShopPagination, { ITEMS_PER_PAGE } from "@/components/molecules/Pagination/ShopPagination";
import TotalVariantSaleRecap from "@/components/molecules/TotalVariantSaleRecap/TotalVariantSaleRecap";
import { SellerPageBreadcrumb } from "@/components/organisms/Breadcrumb/SellerPageBreadcrumb";
import SellerBoard from "@/components/organisms/SellerBoard";
import TabsMenu, { SELLER_TAB, SellerTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useGetProductVariantProductVariantSaleDTOCollection } from "@/networking/sylius-api-client/product-variant-sale-dt-o/product-variant-sale-dt-o";
import {
  useGetTotalProductVariantSaleDTOCollection,
  useGetTotalProductVariantSaleDTOItem,
} from "@/networking/sylius-api-client/total-product-variant-sale-dt-o/total-product-variant-sale-dt-o";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const { t } = useTranslation("section-vendeur");
  const { user } = useAuthenticatedUserContext();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: currentProductVariantsInAuction,
    isFetching,
    isFetched,
    isError,
  } = useGetProductVariantProductVariantSaleDTOCollection(
    {
      finished: true,
      itemsPerPage: ITEMS_PER_PAGE,
      page: currentPage,
      startDate: startDate,
      endDate: endDate,
    },
    { query: { keepPreviousData: true } },
  );

  const { data: totalProductVariantSaleDTOCollection } = useGetTotalProductVariantSaleDTOCollection(
    {
      finished: true,
      itemsPerPage: ITEMS_PER_PAGE,
      page: currentPage,
      startDate: startDate,
      endDate: endDate,
    },
    { query: { keepPreviousData: true } },
  );

  const { data: totalProductVariantSaleDTO } = useGetTotalProductVariantSaleDTOItem(
    user?.customerId ?? "",
    {
      finished: true,
      startDate: startDate,
      endDate: endDate,
    },
  );

  const totalItems = currentProductVariantsInAuction?.["hydra:totalItems"] ?? 0;

  useMountEffect(() => {
    sendGTMEvent({
      page: "vente-historique",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo
        title={t("seo.salesHistory.title")}
        description={t("seo.salesHistory.description")}
      />
      <SellerPageBreadcrumb
        translatedLinkName={SELLER_TAB.HISTORICAL_SELLS}
        sellerTab={t("historicalSells")}
      />
      <div>
        <TabsMenu tabs={SellerTabs} currentTab={SELLER_TAB.HISTORICAL_SELLS} activeTabIsTitle />

        {isError ? (
          <div className={styles.pageBlock}>
            <div>{t("error")}</div>
          </div>
        ) : currentProductVariantsInAuction === undefined ? (
          <></>
        ) : totalItems > 0 ? (
          <div className={styles.boardAndDatePicker}>
            <DatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
            />
            <SellerBoard
              isHistorical
              productVariants={currentProductVariantsInAuction["hydra:member"]}
            />
            {isNotNullNorUndefined(totalProductVariantSaleDTOCollection) &&
              isNotNullNorUndefined(totalProductVariantSaleDTOCollection["hydra:member"][0]) && (
                <TotalVariantSaleRecap
                  totalRecap={totalProductVariantSaleDTOCollection["hydra:member"][0]}
                />
              )}
          </div>
        ) : endDate !== undefined || startDate !== undefined ? (
          <div>
            <DatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
            />
            <div className={styles.noMatchText}>{t("noMatch")}</div>
          </div>
        ) : (
          <div className={styles.pageBlock}>
            <div className={styles.customerBox}>
              <Image src="/empty_cart.png" alt="Empty cart" width={100} height={100} />
              <div className={styles.customerMessage}>
                {t("noHistoricalSells").toLocaleUpperCase()}
              </div>
            </div>
          </div>
        )}
        {isNotNullNorUndefined(totalProductVariantSaleDTO) && totalItems > 0 && (
          <TotalVariantSaleRecap totalRecap={totalProductVariantSaleDTO} global />
        )}
        <ShopPagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          setCurrentPage={setCurrentPage}
          isLoading={isFetching && !isFetched}
        />
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
