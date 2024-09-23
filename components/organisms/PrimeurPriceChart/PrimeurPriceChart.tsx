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
import { Bar } from "react-chartjs-2";

import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { centsToUnits } from "@/utils/formatHandler";
import { useTranslation } from "@/utils/next-utils";
import { getVariation } from "@/utils/primeurPriceVariationHandler";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./PrimeurPriceChart.module.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BLACK = "#000000";
const DARK_BLUE = "#3f4c6b";
const LIGHT_BLUE = "#7f94d3";
const WHITE = "#ffffff";

const MAX_NUMBER_OF_VALUES_DISPLAYED = 4;

type Props = {
  productVintageRatings: ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead[];
  primeurPrice: number | null | undefined;
};
const PrimeurPriceChart = ({ productVintageRatings, primeurPrice }: Props) => {
  const { t } = useTranslation("prix-vin");
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
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t("historicPrimeurPrice", { currencyLogo: currentCurrencyLogo }),
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
        stacked: true,
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  };

  const labels = productVintageRatings
    .slice(-MAX_NUMBER_OF_VALUES_DISPLAYED)
    .map(({ year, value }) => {
      return isNotNullNorUndefined(year) && isNotNullNorUndefined(value) ? year : "";
    });

  const data = {
    labels,
    datasets: [
      {
        data: productVintageRatings.slice(-MAX_NUMBER_OF_VALUES_DISPLAYED).map(({ value }) => {
          const { convertedPrice: valueInActiveCurrency } = convertToActiveCurrency(value ?? 0);

          return centsToUnits(Math.round(valueInActiveCurrency));
        }),
        backgroundColor: DARK_BLUE,
      },
      {
        datalabels: {
          color: BLACK,
          formatter: (value: number) => {
            return `${value} %`;
          },
        },
        data: productVintageRatings.slice(-MAX_NUMBER_OF_VALUES_DISPLAYED).map(({ value }) => {
          return isNotNullNorUndefined(primeurPrice) ? getVariation(value ?? 0, primeurPrice) : "";
        }),
        backgroundColor: LIGHT_BLUE,
      },
    ],
  };

  return <Bar options={options} plugins={[ChartDataLabels]} data={data} className={styles.chart} />;
};

export default PrimeurPriceChart;
