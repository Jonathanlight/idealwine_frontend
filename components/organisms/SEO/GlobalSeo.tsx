import { DefaultSeo, OrganizationJsonLd } from "next-seo";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { HrefLangs } from "@/types/HrefLangs";
import { generateTranslatedUrlRedirectionPerLocale, LOCALES } from "@/urls/linksTranslation";
import { generateTranslatedUrlWithBothData } from "@/utils/generateTranslatedUrlWithBothData";
import { useTranslation } from "@/utils/next-utils";
import { isNullOrUndefined } from "@/utils/ts-utils";

type Props = {
  isOnPLP?: boolean;
  hrefLangs?: HrefLangs;
};

export const GlobalSeo = ({ isOnPLP, hrefLangs }: Props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const { t, lang } = useTranslation("common");
  const translatedUrlRewrite = useMemo(() => generateTranslatedUrlRedirectionPerLocale(), []);
  const dynamicTranslatedUrlRewrite = useMemo(
    () => generateTranslatedUrlRedirectionPerLocale(true),
    [],
  );
  const { asPath } = useRouter();

  const hrefLangsToSet = LOCALES.map(locale => {
    const urlQueryParams = asPath.split("?")[1];
    const translatedUrl = generateTranslatedUrlWithBothData(
      translatedUrlRewrite,
      dynamicTranslatedUrlRewrite,
      isOnPLP,
      {
        pathname: asPath.split("?")[0],
        search: isNullOrUndefined(urlQueryParams) ? "" : `?${urlQueryParams}`,
      },
      hrefLangs,
    )(asPath, locale, lang);
    const translatedUrlUnlessSingleSlash = translatedUrl === "/" ? "" : translatedUrl;
    const hrefWithLangPrefix = `${baseUrl}/${locale}${translatedUrlUnlessSingleSlash}`;

    return {
      hrefLang: locale,
      href: hrefWithLangPrefix,
    };
  });

  const canonicalUrlWithParams =
    hrefLangsToSet.find(({ hrefLang }) => hrefLang === lang)?.href ?? `${baseUrl}/${lang}${asPath}`;
  const canonicalUrl = canonicalUrlWithParams.split("?")[0];

  const title = t("seo.global.title");
  const award = t("seo.global.award");

  return (
    <>
      <DefaultSeo
        title={title}
        canonical={canonicalUrl}
        openGraph={{
          type: "website",
          locale: lang,
          url: canonicalUrlWithParams,
          siteName: "iDealwine",
          images: [
            {
              url: baseUrl + "/logo-idealwine.svg",
              width: 1200,
              height: 630,
              alt: "iDealwine",
            },
          ],
        }}
        twitter={{
          handle: "@iDealwine",
          site: "@iDealwine",
        }}
        languageAlternates={hrefLangsToSet}
      />
      <OrganizationJsonLd
        url={baseUrl}
        logo={baseUrl + "/logo-idealwine.svg"}
        name="iDealwine"
        legalName="IDEALWINE.COM S.A.S."
        foundingDate="2000-05-30"
        founders={[
          {
            "@type": "Person",
            name: "Angélique de Lencquesaing",
          },
          {
            "@type": "Person",
            name: "Cyrille Jomand",
          },
          {
            "@type": "Person",
            name: "Lionel Cuenca",
          },
        ]}
        award={award}
        sameAs={[
          "https://www.youtube.com/user/iDealwineTV",
          "https://www.facebook.com/iDealwine",
          "https://www.pinterest.com/idealwine/",
          "https://www.linkedin.com/company/idealwine",
          "https://twitter.com/idealwine",
          "https://play.google.com/store/apps/details?id=com.twoexvia.idealwine",
          "https://itunes.apple.com/fr/app/idealwine-app/id406868016?mt=8",
        ]}
        contactPoint={[
          {
            contactType: "customer support",
            telephone: "+33156058610",
            email: "info@idealwine.com",
          },
        ]}
        address={{
          streetAddress: "190 rue d'Estienne d'Orves",
          addressLocality: "Colombes",
          addressRegion: "Hauts-de-Seine",
          postalCode: "92700",
          addressCountry: "FR",
        }}
      />
    </>
  );
};
