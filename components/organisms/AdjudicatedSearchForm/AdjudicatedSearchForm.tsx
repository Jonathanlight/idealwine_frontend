import { useRouter } from "next/router";

import { default as Select } from "@/components/atoms/Select";
import RankingSearchFormHeader from "@/components/molecules/RankingSearchFormHeader/RankingSearchFormHeader";
import {
  generateYearsArrayWithPossibleNullDefaultOption,
  noYear,
} from "@/utils/generateArrayOfYears";
import { buildAdjudicatedOnIdealWineUrl } from "@/utils/getAdjudicatedOnIdealWineUrl";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./AdjudicatedSearchForm.module.scss";

export const ADJUDICATIONS_STARTING_YEAR = 2013;

const AdjudicatedSearchForm = () => {
  const { t, lang } = useTranslation("prix-vin");

  const router = useRouter();

  const yearOptions = Array.from(
    generateYearsArrayWithPossibleNullDefaultOption(ADJUDICATIONS_STARTING_YEAR, true),
  ).map(year => ({
    label: year !== null ? year.toString() : t("yearSelect.adjudicatedAllYears"),
    value: year !== null ? year.toString() : noYear,
  }));

  return (
    <div className={styles.adjudicatedSearchForm}>
      <RankingSearchFormHeader
        image="/marteau.png"
        alt="Hammer"
        title={t("adjudicated.title")}
        underTitle={t("adjudicated.subtitle")}
      />
      <Select
        className={styles.select}
        placeholder={t("vintageYear")}
        options={{ groups: [{ key: "", title: "", options: yearOptions }] }}
        onValueChange={async (value: string) => {
          await router.push(buildAdjudicatedOnIdealWineUrl(lang, value));
        }}
      />
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default AdjudicatedSearchForm;
