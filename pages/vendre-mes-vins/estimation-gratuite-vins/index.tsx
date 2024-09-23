import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { captureException } from "@sentry/nextjs";
import { NextSeo } from "next-seo";

import { SellYourWinePageBreadcrumb } from "@/components/organisms/Breadcrumb/SellYourWinePageBreadcrumb";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useShopGetCustomerItem } from "@/networking/sylius-api-client/customer/customer";
import { Locale } from "@/urls/linksTranslation";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const idealWineLangToIframeLang = (lang: Locale) => {
  switch (lang) {
    case "fr":
      return "fr";
    case "en":
      return "uk";
    case "de":
      return "de";
    case "it":
      return "it";
    default:
      // in case of unknown lang, we default to fr and log the error on Sentry to not break the iframe
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      captureException(new Error(`Unknown lang: ${lang}`));

      return "fr";
  }
};

const Page = () => {
  const { t } = useTranslation("estimation-gratuite-vins");

  const { user } = useAuthenticatedUserContext();

  const { data: customer } = useShopGetCustomerItem(user?.customerId ?? "", {
    query: { enabled: isNotNullNorUndefined(user) },
  });

  const searchParams = new URLSearchParams({
    nom: customer?.lastName ?? "",
    prenom: customer?.firstName ?? "",
    adresse: customer?.defaultAddress?.street ?? "",
    postal: customer?.defaultAddress?.postcode ?? "",
    ville: customer?.defaultAddress?.city ?? "",
    pays: customer?.defaultAddress?.countryCode ?? "",
    tel: customer?.phoneNumber ?? "",
    mail: customer?.email ?? "",
  }).toString();

  const { lang } = useTranslation();

  const iframeLang = idealWineLangToIframeLang(lang);

  useMountEffect(() => {
    sendGTMEvent({
      page: "formulaire_vendeur",
      pageChapter1: "vendre_mes_vins",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <SellYourWinePageBreadcrumb
        translatedSellMyWines={t("sellYourWines")}
        translatedLinkName="FREE_WINE_ESTIMATION_URL"
        sellerTab={t("freeEstimate")}
      />
      <h1 className={styles.title}>
        <strong>
          1<sup>{t("estimateTitle1")} </sup>
          {t("estimateTitle2").toLocaleUpperCase()}{" "}
        </strong>
        {t("estimateTitle3").toLocaleUpperCase()}
      </h1>
      <iframe
        className={styles.iframe}
        title="free-estimation"
        src={`https://estimation-${iframeLang}.idealwine.com/estim.php?${searchParams}`}
        frameBorder="0"
        scrolling="auto"
        width="100%"
      />
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
