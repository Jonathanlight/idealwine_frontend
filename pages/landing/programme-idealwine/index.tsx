import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import Trans from "next-translate/Trans";
import Image from "next/image";

import Bookmark from "@/components/molecules/Bookmark";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const NB_OF_ADVATANGES_PER_PROGRAM = 7;
  const { t } = useTranslation("programme-idealwine");

  const createAdvantagesTab = (
    program: "quintessence" | "ideal" | "privilege" | "classique",
  ): Array<string> => {
    const advantages: string[] = [];
    for (let i = 1; i <= NB_OF_ADVATANGES_PER_PROGRAM; i++) {
      const tmp: string = t(`${program}.advantages.advantage${i}`, undefined, {
        fallback: "-",
      });
      advantages.push(tmp);
    }

    return advantages;
  };

  useMountEffect(() => {
    sendGTMEvent({
      page: "programme_fidelité",
      pageChapter1: "services",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.content}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <section className={styles.mainSection}>
        <div className={styles.titleAndIntroDiv}>
          <h1 className={styles.loyaltyProgramsTitle}>{t("programsTitle")}</h1>
          <h2 className={styles.loyaltyProgramsIntroduction}>
            <Trans
              ns="programme-idealwine"
              i18nKey="programsIntroduction"
              // eslint-disable-next-line react/jsx-key
              components={[<br className={styles.br} />]}
            />
          </h2>
        </div>
        <article className={styles.articleLoyaltyPrograms}>
          <Bookmark
            imageSrc="/loyaltyProgramLogos/none_white.svg"
            title={t("classique.title")}
            subtitle={t("classique.subtitle")}
            program="classique"
            advantages={createAdvantagesTab("classique")}
          />
          <Bookmark
            imageSrc="/loyaltyProgramLogos/privilege.svg"
            title={t("privilege.title")}
            subtitle={t("privilege.subtitle")}
            program="privilege"
            advantages={createAdvantagesTab("privilege")}
          />
          <Bookmark
            imageSrc="/loyaltyProgramLogos/ideal.svg"
            title={t("ideal.title")}
            subtitle={t("ideal.subtitle")}
            program="ideal"
            advantages={createAdvantagesTab("ideal")}
          />
          <Bookmark
            imageSrc="/loyaltyProgramLogos/quintessence.svg"
            title={t("quintessence.title")}
            subtitle={t("quintessence.subtitle")}
            program="quintessence"
            advantages={createAdvantagesTab("quintessence")}
          />
          <small className={styles.programsConditions}>
            {
              <Trans
                ns="programme-idealwine"
                i18nKey="programsConditions"
                // eslint-disable-next-line react/jsx-key
                components={[<br className={styles.br} />]}
              />
            }
          </small>
        </article>
      </section>
      <section className={styles.sectionPromotion}>
        <aside className={styles.promotionNewClient}>
          <Image
            src="/new-client-promo.jpg"
            alt="iDealwine offers new client 15€ discount"
            width={350}
            height={200}
            className={styles.imagePromoNewClient}
          />
          <div className={styles.contentPromoNewClient}>
            <h4 className={styles.stillNotClientTitle}>{t("notACustomerYet")}</h4>
            <p className={styles.stillNotClientOffer}>{t("offerNotClient")}</p>
            <p>
              <Trans
                ns="programme-idealwine"
                i18nKey="offerNotClientConditions"
                // eslint-disable-next-line react/jsx-key
                components={[<strong />]}
              />
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
