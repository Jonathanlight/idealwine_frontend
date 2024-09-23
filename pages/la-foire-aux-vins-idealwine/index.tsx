import { faGlassesAlt } from "@fortawesome/pro-thin-svg-icons/faGlassesAlt";
import { faGraduationCap } from "@fortawesome/pro-thin-svg-icons/faGraduationCap";
import { faMapMarkerQuestion } from "@fortawesome/pro-thin-svg-icons/faMapMarkerQuestion";
import { faWineGlassAlt } from "@fortawesome/pro-thin-svg-icons/faWineGlassAlt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextSeo } from "next-seo";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { getTransP } from "@/components/atoms/TransP";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("foire-aux-vins");
  const TransP = getTransP("foire-aux-vins");

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.favpart1}>
        <div className={styles.flex2}>
          <div className={`${styles.div1} ${styles.custom}`}>
            <h1 className={`${styles.title} ${styles.flex2}`}>
              <TransP i18nKey="fav-foire" />

              <small className={styles.small1}>
                <TransP i18nKey="fav-aux" />
              </small>

              <TransP i18nKey="fav-vins" />
            </h1>
            <LinkButton href="FAV_URL_SELECTION" variant="primaryBlack">
              <TransP i18nKey="discover" />
            </LinkButton>
          </div>
          <div className={`${styles.div2} ${styles.custom}`}></div>
          <div className={`${styles.div3} ${styles.custom}`}></div>
          <div className={`${styles.div4} ${styles.custom}`}></div>
          <div className={`${styles.div5} ${styles.custom}`}></div>
        </div>

        <div className={`${styles.paragraphe} ${styles.flex2}`}>
          <div className={styles.divcustom}>
            <div className={styles.flex4}>
              <FontAwesomeIcon icon={faGraduationCap} className={styles.icons} />
              <h2 className={styles.h2}>{t("titlePart1")}</h2>
            </div>

            <TransP i18nKey="contentPart1" />
          </div>

          <div className={styles.divcustom}>
            <div className={styles.flex4}>
              <FontAwesomeIcon icon={faMapMarkerQuestion} className={styles.icons} />
              <h2 className={styles.h2}>{t("titlePart2")}</h2>{" "}
            </div>

            <TransP i18nKey="contentPart2" />
          </div>

          <div className={styles.divcustom}>
            <div className={styles.flex4}>
              <FontAwesomeIcon icon={faWineGlassAlt} className={styles.icons} />

              <h2 className={styles.h2}>{t("titlePart3")}</h2>
            </div>

            <TransP i18nKey="contentPart3" />
          </div>

          <div className={styles.divcustom}>
            <div className={styles.flex4}>
              <FontAwesomeIcon icon={faGlassesAlt} className={styles.icons} />{" "}
              <h2 className={styles.h2}>{t("titlePart4")}</h2>
            </div>

            <TransP i18nKey="contentPart4" />
          </div>
          <LinkButton href="FAV_URL_SELECTION" variant="primaryBlack">
            {t("discover")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
