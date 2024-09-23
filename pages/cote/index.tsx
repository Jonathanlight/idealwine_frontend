import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import Trans from "next-translate/Trans";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import AdjudicatedSearchForm from "@/components/organisms/AdjudicatedSearchForm/AdjudicatedSearchForm";
import AlgoliaVintageRatingSearchBox from "@/components/organisms/AlgoliaVintageRatingSearchBox";
import RatingRankingSearchForm from "@/components/organisms/RatingRankingSearchForm/RatingRankingSearchForm";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const emailEstimation = process.env.NEXT_PUBLIC_EMAIL_APPRAISAL_TEAM_IDW ?? "";

const Page = (): JSX.Element => {
  const { t } = useTranslation("prix-vin");

  const subject = encodeURIComponent(t("index.unfindableVintageRating.mail.subject"));
  const mailTo = `mailto:${emailEstimation}?subject=${subject}`;

  useMountEffect(() => {
    sendGTMEvent({
      page: "accueil_cote",
      pageChapter1: "cotation_des_vins",
      pageChapter2: "",
    });
  });

  return (
    <>
      <NextSeo title={t("indexSeo.title")} description={t("indexSeo.description")} />
      <AlgoliaVintageRatingSearchBox></AlgoliaVintageRatingSearchBox>
      <div className={styles.cantFindARating}>
        {t("index.unfindableVintageRating.cantFindARating")}
        <TranslatableLink href={mailTo} className={clsx(styles.link)} dontTranslate>
          {t("index.unfindableVintageRating.mail.linkText")}
        </TranslatableLink>
      </div>
      <h2 className={styles.title}>{t("index.whyIsIdwsRatingGood.title")}</h2>
      <div className={styles.text}>
        <p>
          <Trans
            ns="prix-vin"
            i18nKey="index.whyIsIdwsRatingGood.text1"
            components={{ strong: <strong /> }}
          />
        </p>
        <p>
          <Trans
            ns="prix-vin"
            i18nKey="index.whyIsIdwsRatingGood.text2"
            components={{ strong: <strong /> }}
          />
        </p>
        <p>
          <Trans
            ns="prix-vin"
            i18nKey="index.whyIsIdwsRatingGood.text3"
            components={{ strong: <strong /> }}
          />
        </p>
        <p>
          <Trans
            ns="prix-vin"
            i18nKey="index.whyIsIdwsRatingGood.text4"
            components={{ strong: <strong /> }}
          />
        </p>
        <p>
          <Trans
            ns="prix-vin"
            i18nKey="index.whyIsIdwsRatingGood.text5"
            components={{ strong: <strong /> }}
          />
        </p>
      </div>
      <div className={styles.searchBoxs}>
        <AdjudicatedSearchForm />
        <RatingRankingSearchForm />
      </div>
    </>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
