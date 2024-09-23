import Image from "next/image";
import { useRouter } from "next/router";

import Button from "@/components/atoms/Button";
import { ADJUDICATIONS_STARTING_YEAR } from "@/components/organisms/AdjudicatedSearchForm/AdjudicatedSearchForm";
import { buildAdjudicatedOnIdealWineUrl } from "@/utils/getAdjudicatedOnIdealWineUrl";
import { RatingsSearchParamType } from "@/utils/getRegionAndYearFromSlug";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./RankingAdjudicatedPageTitle.module.scss";

type Props = {
  searchParams: RatingsSearchParamType;
};

const currentYear = new Date().getFullYear();

const RankingAdjudicatedPageTitle = ({ searchParams }: Props) => {
  const { t, lang } = useTranslation("prix-vin");

  const router = useRouter();

  return (
    <div className={styles.container}>
      <Image src={"/marteau.png"} alt="Hammer" width={100} height={100} />
      <p className={styles.title}>{t("top50mostExpensiveWines.title")}</p>
      <div className={styles.underTitleBox}>
        <p>
          {t("top50mostExpensiveWines.subtitle1")}
          <span className={styles.deal}>{t("top50mostExpensiveWines.subtitle2")}</span>
          {t("top50mostExpensiveWines.subtitle3")} {searchParams.year}
        </p>
      </div>
      <div>
        {t("top50mostExpensiveWines.underTitle")} <strong>{searchParams.year}</strong>.
      </div>
      <div className={styles.buttons}>
        {isNotNullNorUndefined(searchParams.year) &&
          Number(searchParams.year) <= currentYear &&
          Number(searchParams.year) > ADJUDICATIONS_STARTING_YEAR && (
            <Button
              className={styles.button}
              variant="primaryBlack"
              onClick={async () => {
                await router.push(
                  buildAdjudicatedOnIdealWineUrl(lang, String(Number(searchParams.year) - 1)),
                );
              }}
            >
              {t("rankingYear", { year: String(Number(searchParams.year) - 1) })}
            </Button>
          )}
        {isNotNullNorUndefined(searchParams.year) &&
          Number(searchParams.year) < currentYear &&
          Number(searchParams.year) >= ADJUDICATIONS_STARTING_YEAR && (
            <Button
              variant="primaryBlack"
              className={styles.button}
              onClick={async () => {
                await router.push(
                  buildAdjudicatedOnIdealWineUrl(lang, String(Number(searchParams.year) + 1)),
                );
              }}
            >
              {t("rankingYear", { year: Number(searchParams.year) + 1 })}
            </Button>
          )}
      </div>
    </div>
  );
};

export default RankingAdjudicatedPageTitle;
