import { useState } from "react";

import Button from "@/components/atoms/Button";
import { default as Select, default as SelectCustom } from "@/components/atoms/Select";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import RankingSearchFormHeader from "@/components/molecules/RankingSearchFormHeader/RankingSearchFormHeader";
import TooltipCustom from "@/components/molecules/Tooltip/Tooltip";
import {
  generateYearsArrayWithPossibleNullDefaultOption,
  noYear,
} from "@/utils/generateArrayOfYears";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { buildRatingRakingUrl } from "@/utils/getRatingRakingUrl";
import { useTranslation } from "@/utils/next-utils";

import styles from "./RatingRankingSearchForm.module.scss";
import { noRegion, ratingRankingSearchFormRegionChoices } from "./enum";

const RATINGS_STARTING_YEAR = 1900;

const RatingRankingSearchForm = () => {
  const { t, lang } = useTranslation("prix-vin");
  const [selectedRegion, setSelectedRegion] = useState<string>(noRegion.value);
  const [selectedVintageYear, setSelectedVintageYear] = useState<string>(noYear);

  const regionOptions = Array.from(ratingRankingSearchFormRegionChoices).map(region => ({
    label: t(`regionSelect.${region.name}`),
    value: region.value,
  }));

  const vintageYearOptions = Array.from(
    generateYearsArrayWithPossibleNullDefaultOption(RATINGS_STARTING_YEAR, true),
  ).map(year => ({
    label: year !== null ? year.toString() : t("yearSelect.noYear"),
    value: year !== null ? year.toString() : noYear,
  }));

  return (
    <div className={styles.ratingRankingSearchForm}>
      <RankingSearchFormHeader
        image="/money.png"
        alt="Coins"
        title={t("ratingRanking.title")}
        underTitle={t("ratingRanking.subtitle")}
      />
      <SelectCustom
        className={styles.select}
        placeholder={t("region")}
        options={{ groups: [{ key: "", title: "", options: regionOptions }] }}
        onValueChange={(value: string) => {
          setSelectedRegion(value);
        }}
      />
      <Select
        className={styles.select}
        placeholder={t("vintageYear")}
        options={{ groups: [{ key: "", title: "", options: vintageYearOptions }] }}
        onValueChange={(value: string) => {
          setSelectedVintageYear(value);
        }}
      />
      {selectedRegion === noRegion.value && selectedVintageYear === noYear ? (
        <TooltipCustom
          trigger={
            <Button className={styles.button} disabled>
              ok{" "}
            </Button>
          }
          contentProps={{ side: "bottom" }}
        >
          <span>{t("selectSomething")}</span>
        </TooltipCustom>
      ) : (
        <TranslatableLink
          dontTranslate
          className={styles.button}
          href={buildRatingRakingUrl(lang, selectedVintageYear, selectedRegion)}
        >
          <Button>ok</Button>
        </TranslatableLink>
      )}
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default RatingRankingSearchForm;
