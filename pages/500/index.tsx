import { NextSeo } from "next-seo";

import ErrorPage from "@/components/organisms/GeneralLayout/errorPage";
import { useTranslation } from "@/utils/next-utils";

const Page = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <ErrorPage statusCode={500}>
      <>
        <NextSeo title={t("errors:404.seo.title")} description={t("errors:404.seo.description")} />
        <p>{t("errors:500.descriptionLine1")}</p>
        <p>
          {t("errors:500.descriptionLine2Text1")}{" "}
          <a href={t("common:urls.urlBlogIdealwine")} target="_blank" rel="noreferrer">
            {t("errors:500.descriptionLine2Link1")}
          </a>
          {t("errors:500.descriptionLine2Text2")}{" "}
          <a href={t("common:urls.urlFacebook")} target="_blank" rel="noreferrer">
            {t("errors:500.descriptionLine2Link2")}
          </a>
          {t("errors:500.descriptionLine2Text3")}{" "}
          <a href={t("common:urls.urlInstagram")} target="_blank" rel="noreferrer">
            {t("errors:500.descriptionLine2Link3")}
          </a>
          {t("errors:500.descriptionLine2Text4")}{" "}
          <a href={t("common:urls.urlTwitter")} target="_blank" rel="noreferrer">
            {t("errors:500.descriptionLine2Link4")}
          </a>
          {t("errors:500.descriptionLine2Text5")}
        </p>
      </>
    </ErrorPage>
  );
};

export default Page;
