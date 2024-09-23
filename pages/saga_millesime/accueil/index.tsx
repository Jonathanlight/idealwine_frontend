import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import { useState } from "react";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { getTransP } from "@/components/atoms/TransP";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { RegionJsonldName } from "@/networking/sylius-api-client/.ts.schemas";
import { SagaMillesime } from "@/utils/dynamicMenuConstants";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";
const Page = () => {
  const TransP = getTransP("saga-millesime");
  const { t, lang } = useTranslation("saga-millesime");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOption2, setSelectedOption2] = useState<string | null>(null);
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  const selectChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption2(event.target.value);
  };

  useMountEffect(() => {
    sendGTMEvent({
      page: "saga_millesime",
      pageChapter1: "edito",
      pageChapter2: "",
    });
  });

  const listRegion: RegionJsonldName[] = [
    "ALSACE",
    "BEAUJOLAIS",
    "BORDEAUX",
    "BOURGOGNE",
    "CHAMPAGNE",
    "JURA",
    "SAVOIE",
    "LANGUEDOC",
    "PROVENCE",
    "CORSE",
    "ROUSSILLON",
    "SUD_OUEST",
    "VALLEE_DE_LA_LOIRE",
    "VALLEE_DU_RHONE",
    "AUSTRALIE",
    "ESPAGNE",
    "ITALIE",
    "PORTUGAL",
    "ETATS_UNIS",
  ];

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />

      <div className={styles.containersaga}>
        <div className={styles.souscontainer}>
          <h1 className={styles.h1}>{t("h1")}</h1>
          <form name="accueil" method="post" action="" className={styles.form}>
            <select onChange={selectChange} className={styles.regionsearchfield}>
              <option selected disabled>
                {t("choisirRegion")}
              </option>
              {listRegion.map(key => (
                <option key={key} value={key}>
                  {t(`enums:region.${key}`)}
                </option>
              ))}
            </select>

            <select onChange={selectChange2} className={styles.regionsearchfield}>
              <option selected disabled>
                {t("choisirMillesime")}
              </option>
              {SagaMillesime.map(key => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            {selectedOption !== null && selectedOption2 !== null && (
              <LinkButton
                dontTranslate
                href={getPlpUrl({ region: [selectedOption], vintage: [selectedOption2] }, lang)}
              >
                {t("valider")}
              </LinkButton>
            )}
          </form>

          <h3> {t("ariane2")} </h3>
          <TransP i18nKey="p1" />

          <TransP i18nKey="p2" />

          <TransP i18nKey="p3" />

          <LinkButton href="VINTAGE_TABLE_NOTATION_URL" variant="primaryBlack">
            {t("vintageNotes")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;
export default Page;
