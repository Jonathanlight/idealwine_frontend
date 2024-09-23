import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { NextSeo } from "next-seo";

import Button from "@/components/atoms/Button/Button";
import { getTransP } from "@/components/atoms/TransP";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { TRIPLE_A_VALUES } from "@/utils/constants";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t, lang } = useTranslation("triple-A");
  const TransP = getTransP("triple-A");

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.bg}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>{t("titlePart1")}</h1>
          <TransP i18nKey="contentPart1" />
          <TransP i18nKey="contentPart2" />
          <p
            className={styles.bg2}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("contentPart3")) }}
          />

          <p>{t("last")}</p>
          <TranslatableLink
            className={clsx(styles.linka)}
            href={getPlpUrl({ biologicProfile: TRIPLE_A_VALUES }, lang)}
            dontTranslate
          >
            <Button variant="secondaryGolden">{t("discover")}</Button>
          </TranslatableLink>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
