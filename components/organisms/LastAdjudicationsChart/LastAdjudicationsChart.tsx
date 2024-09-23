import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import React from "react";
import { Bar } from "react-chartjs-2";

import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { ProductVariantJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { centsToUnits } from "@/utils/formatHandler";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./LastAdjudicationsChart.module.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BLACK = "#000000";
const WHITE = "#ffffff";
const HOVER = "#a7813d";
const NUMBER_OF_VALUES_DISPLAYED = 4;

export const LastAdjudicationsChart = ({
  lastAdjudications,
  vintageYear,
}: {
  lastAdjudications: ProductVariantJsonldShopProductVintageRatingInfoDtoRead[];
  vintageYear: number | string;
}): JSX.Element => {
  const { t, lang } = useTranslation("prix-vin");
  const { currentCurrencyLogo } = useCurrentCurrency();
  const { convertToActiveCurrency } = useCurrencyConverter();

  const options = {
    responsive: true,

    plugins: {
      datalabels: {
        color: WHITE,
        font: {
          weight: "bold" as const,
        },
        formatter: (value: number) => {
          return `${value}`;
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t("lastAdjudications", { year: vintageYear, currencyLogo: currentCurrencyLogo }),
        position: "bottom" as const,
        font: {
          style: "italic" as const,
          size: 12,
          weight: "normal" as const,
        },
        color: BLACK,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const labels = lastAdjudications
    .slice(-NUMBER_OF_VALUES_DISPLAYED)
    .map(({ soldAt }) =>
      isNotNullNorUndefined(soldAt) ? new Date(soldAt).toLocaleDateString(lang) : "",
    );

  const data = {
    labels,
    datasets: [
      {
        data: lastAdjudications.slice(-NUMBER_OF_VALUES_DISPLAYED).map(({ historicPrice }) => {
          const { convertedPrice: priceInActiveCurrency } = convertToActiveCurrency(
            historicPrice ?? 0,
          );

          return Math.round(centsToUnits(priceInActiveCurrency));
        }),
        backgroundColor: BLACK,
        hoverBackgroundColor: HOVER,
      },
    ],
  };

  return <Bar options={options} plugins={[ChartDataLabels]} data={data} className={styles.chart} />;
};

export default LastAdjudicationsChart;
