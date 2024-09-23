import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Scale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { RatingVariationJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { centsToUnits } from "@/utils/formatHandler";
import { useTranslation } from "@/utils/next-utils";

import styles from "./RatingsVariationHorizontalChart.module.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const RatingsVariationHorizontalChart = ({
  vintageYear,
  ratingsVariations,
}: {
  vintageYear: number | string;
  ratingsVariations: RatingVariationJsonldShopProductVintageRatingInfoDtoRead[];
}): JSX.Element => {
  const { t } = useTranslation("prix-vin");
  const { currentCurrencyLogo } = useCurrentCurrency();
  const { convertToActiveCurrency } = useCurrencyConverter();

  const BLACK = "#000000";
  const GREY = "#cacaca";
  const GOLDEN = "#a7813d";
  const AXIS_GREY = "#dfdfdf";

  const options = {
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        color: AXIS_GREY,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (this: Scale, value: string | number) {
            const label: string = this.getLabelForValue(Number(value));

            return t("years", { count: label });
          },
        },
      },
    },
    indexAxis: "y" as const,

    responsive: true,
    plugins: {
      datalabels: {
        color: GOLDEN,
        font: {
          weight: "bold" as const,
        },
      },
      legend: {
        display: false,
      },
    },
  };

  const labels = ratingsVariations.map(ratingVariation => ratingVariation.yearGap);

  const data = {
    labels,
    datasets: [
      {
        label: t("price"),
        datalabels: {
          formatter: (value: number) => {
            return `${value} ${currentCurrencyLogo}`;
          },
        },
        data: ratingsVariations.map(ratingVariation => {
          const { convertedPrice: priceInActiveCurrency } = convertToActiveCurrency(
            ratingVariation.rating ?? 0,
          );

          return Math.round(centsToUnits(priceInActiveCurrency));
        }),
        borderColor: BLACK,
        backgroundColor: BLACK,
      },
      {
        label: t("percentage"),
        datalabels: {
          formatter: (value: number) => {
            return `${value} %`;
          },
        },
        data: ratingsVariations.map(ratingVariation => ratingVariation.variation),
        borderColor: GREY,
        backgroundColor: GREY,
      },
    ],
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.blockTitle}>{t("ratingsVariation", { year: vintageYear })}</div>
      </div>
      <Bar options={options} plugins={[ChartDataLabels]} data={data} />
    </>
  );
};

export default RatingsVariationHorizontalChart;
