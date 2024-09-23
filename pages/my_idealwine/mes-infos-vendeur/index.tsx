import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import React from "react";

import Button from "@/components/atoms/Button/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { SellerPageBreadcrumb } from "@/components/organisms/Breadcrumb/SellerPageBreadcrumb";
import SellerForm from "@/components/organisms/SellerForm/SellerForm";
import TabsMenu, { SELLER_TAB, SellerTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useShopGetCustomerItem } from "@/networking/sylius-api-client/customer/customer";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation("section-vendeur");
  const { user } = useAuthenticatedUserContext();

  const { data: customer, isLoading: isCustomerLoading } = useShopGetCustomerItem(
    user?.customerId ?? "",
  );

  useMountEffect(() => {
    sendGTMEvent({
      page: "mes-infos-vendeur",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.sellerInfo.title")} description={t("seo.sellerInfo.description")} />
      <SellerPageBreadcrumb
        translatedLinkName={SELLER_TAB.MY_SELLER_INFORMATION}
        sellerTab={t("mySellerInformation")}
      />
      <div>
        <TabsMenu
          tabs={SellerTabs}
          currentTab={SELLER_TAB.MY_SELLER_INFORMATION}
          activeTabIsTitle
        />

        <div className={styles.pageBlock}>
          {isCustomerLoading ? (
            <p>{t("isLoading")}</p>
          ) : user?.canSell !== true ? (
            <div className={styles.sellerBox}>
              <div className={styles.sellerMessage}>
                {t("notSellerOne")} <br />
                {t("notSellerTwo")}
              </div>
              <Button className={styles.sellerButton}>
                <TranslatableLink href="FREE_WINE_ESTIMATION_URL">
                  {t("notSellerButton")}
                </TranslatableLink>
              </Button>
            </div>
          ) : (
            <SellerForm customer={customer ?? undefined} />
          )}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
