import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { SellerPageBreadcrumb } from "@/components/organisms/Breadcrumb/SellerPageBreadcrumb";
import TabsMenu, { SELLER_TAB, SellerTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation("section-vendeur");

  useMountEffect(() => {
    sendGTMEvent({
      page: "vendre-mes-bouteilles",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.sellMyWine.title")} description={t("seo.sellMyWine.description")} />
      <SellerPageBreadcrumb
        translatedLinkName={SELLER_TAB.SELL_MY_BOTTLES}
        sellerTab={t("sellMyBottles")}
      />
      <div>
        <TabsMenu tabs={SellerTabs} currentTab={SELLER_TAB.SELL_MY_BOTTLES} activeTabIsTitle />
        <div className={styles.pageBlock}>
          <div className={styles.message}>
            <p className={styles.title}>{t("sellYourBottles").toLocaleUpperCase()}</p> <br />
            {t("withIdealwine")} <br />- {t("freeEstimate")} <br />- {t("globalServiceOffer")}{" "}
            <br />- {t("guaranteedPaiement")} <br />- {t("guaranteedTransaction")} <br />
          </div>
          <LinkButton variant="primaryBlack" href="FREE_WINE_ESTIMATION_URL" target="_blank">
            {t("estimfree")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
