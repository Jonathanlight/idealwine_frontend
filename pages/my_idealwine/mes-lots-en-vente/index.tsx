import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import Image from "next/image";
import React, { useState } from "react";

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
  const { t } = useTranslation("section-vendeur");
  const { user } = useAuthenticatedUserContext();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: currentProductVariantsInAuction,
    isFetching,
    isFetched,
    isError,
  } = useGetProductVariantProductVariantSaleDTOCollection(
    { current: true, itemsPerPage: ITEMS_PER_PAGE, page: currentPage },
    { query: { keepPreviousData: true } },
  );

  const { data: totalProductVariantSaleDTOCollection } = useGetTotalProductVariantSaleDTOCollection(
    {
      current: true,
      itemsPerPage: ITEMS_PER_PAGE,
      page: currentPage,
    },
    { query: { keepPreviousData: true } },
  );

  const { data: totalProductVariantSaleDTO } = useGetTotalProductVariantSaleDTOItem(
    user?.customerId ?? "",
    {
      current: true,
    },
  );

  const totalItems = currentProductVariantsInAuction?.["hydra:totalItems"] ?? 0;

  useMountEffect(() => {
    sendGTMEvent({
      page: "mes-lots-en-vente",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo
        title={t("seo.ongoingSales.title")}
        description={t("seo.ongoingSales.description")}
      />
      <SellerPageBreadcrumb
        translatedLinkName={SELLER_TAB.ONGOING_SELLS}
        sellerTab={t("ongoingSells")}
      />
      <div>
        <TabsMenu tabs={SellerTabs} currentTab={SELLER_TAB.ONGOING_SELLS} activeTabIsTitle />
        {isError ? (
          <div className={styles.pageBlock}>
            <div>{t("error")}</div>
          </div>
        ) : currentProductVariantsInAuction === undefined ? (
          <></>
        ) : totalItems === 0 ? (
          <div className={styles.pageBlock}>
            <div className={styles.customerBox}>
              <Image src="/empty_cart.png" alt="Empty cart" width={100} height={100} />
              <div className={styles.customerMessage}>
                {t("noOngoingSells").toLocaleUpperCase()}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.boardWithDescription}>
            <span className={styles.description}>
              {t("currentlyOnSellProductVariant").toLocaleUpperCase()}
            </span>
            <SellerBoard productVariants={currentProductVariantsInAuction["hydra:member"]} />
            {isNotNullNorUndefined(totalProductVariantSaleDTOCollection) &&
              isNotNullNorUndefined(totalProductVariantSaleDTOCollection["hydra:member"][0]) && (
                <TotalVariantSaleRecap
                  totalRecap={totalProductVariantSaleDTOCollection["hydra:member"][0]}
                  current
                />
              )}
          </div>
        )}
        {isNotNullNorUndefined(totalProductVariantSaleDTO) && totalItems > 0 && (
          <TotalVariantSaleRecap totalRecap={totalProductVariantSaleDTO} global current />
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
