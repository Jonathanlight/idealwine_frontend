import { NextSeo } from "next-seo";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import ErrorPage from "@/components/organisms/GeneralLayout/errorPage";
import { useTranslation } from "@/utils/next-utils";

const Page = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <ErrorPage secondTitle statusCode={404}>
      <>
        <NextSeo title={t("errors:404.seo.title")} description={t("errors:404.seo.description")} />
        <p>
          {t("errors:404.descriptionLine1")}{" "}
          <TranslatableLink href="HOME_URL">{t("errors:404.descriptionLink1")}</TranslatableLink>
        </p>
        <p>
          {t("errors:404.descriptionLine2")}{" "}
          <a href={t("common:urls.urlBlogIdealwine")} target="_blank" rel="noreferrer">
            {t("errors:404.descriptionLink2")}
          </a>
        </p>
        <p>
          {t("errors:404.descriptionLine3")}{" "}
          <TranslatableLink href="CONTACT_URL">{t("errors:404.descriptionLink3")}</TranslatableLink>
        </p>
      </>
    </ErrorPage>
  );
};

export default Page;
