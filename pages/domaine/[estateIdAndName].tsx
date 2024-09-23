import { GetStaticPaths } from "next";
import { memo } from "react";

import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import {
  getByExternalIdEstateItem,
  getGetByExternalIdEstateItemQueryKey,
} from "@/networking/sylius-api-client/estate/estate";
import { isLocale, Locale } from "@/urls/linksTranslation";
import { DecoratedGetStaticProps, withCommonPagePropsDecorator } from "@/utils/getCommonPageProps";
import { nextLangToSyliusLocale } from "@/utils/locale";

const Page = (): JSX.Element => {
  return <div />;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const getStaticPageProps: DecoratedGetStaticProps = async ({ params, locale, queryClient }) => {
  const estateId =
    typeof params?.estateIdAndName === "string" ? params.estateIdAndName.split("-")[0] : null;

  if (estateId === null) {
    return {
      notFound: true,
    };
  }

  try {
    const estate = await queryClient.fetchQuery({
      queryKey: getGetByExternalIdEstateItemQueryKey(estateId),
      queryFn: () =>
        getByExternalIdEstateItem(estateId, {
          headers: { "Accept-Language": nextLangToSyliusLocale(locale) },
        }),
    });

    if (typeof estate.name === "string") {
      const lang = typeof locale === "string" && isLocale(locale) ? locale : ("fr" as Locale);
      const plpUrl = getPlpUrl({ domainName: [estate.name] }, lang);

      return {
        redirect: {
          destination: plpUrl,
          statusCode: 301,
        },
      };
    }
  } catch (error) {
    // ignore missing domains
  }

  return {
    notFound: true,
  };
};

export const getStaticProps = withCommonPagePropsDecorator(getStaticPageProps);

export default memo(Page);
