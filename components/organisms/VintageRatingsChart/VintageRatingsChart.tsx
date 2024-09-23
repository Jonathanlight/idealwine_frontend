import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import ChartjsPluginWatermark from "chartjs-plugin-watermark";
import React from "react";
import { Line } from "react-chartjs-2";

import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { centsToUnits } from "@/utils/formatHandler";
import { useTranslation } from "@/utils/next-utils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.register(ChartjsPluginWatermark);

const VintageRatingsChart = ({
  productVintageRatings,
}: {
  productVintageRatings: ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead[];
}) => {
  const { t } = useTranslation("rating-graph");

  const { currentCurrencyLogo } = useCurrentCurrency();
  const { convertToActiveCurrency } = useCurrencyConverter();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "black",
        },
      },
    },
    // container for watermark options
    watermark: {
      // the image you would like to show
      // alternatively, this can be of type "Image"
      image: "/logo-idealwine.svg",

      // x and y offsets of the image
      x: 0,
      y: 0,

      // width and height to resize the image to
      // image is not resized if these values are not set
      width: 200,
      height: 54,

      // opacity of the image, from 0 to 1 (default: 1)
      opacity: 0.6,

      // x-alignment of the image (default: "left")
      // valid values: "left", "middle", "right"
      alignX: "middle",
      // y-alignment of the image (default: "top")
      // valid values: "top", "middle", "bottom"
      alignY: "middle",

      // if true, aligns the watermark to the inside of the chart area (where the lines are)
      // (where the lines are)
      // if false, aligns the watermark to the inside of the canvas
      // see samples/alignToChartArea.html
      alignToChartArea: false,

      // determines whether the watermark is drawn on top of or behind the chart
      // valid values: "front", "back"
      position: "back",
    },
    scales: {
      y: {
        min: 0,
      },
    },
  };

  const labels = productVintageRatings.map(r => r.year ?? 0);

  const data_chart = {
    labels,
    datasets: [
      {
        label: t("ratingEvolutionGraphLabel", { currencyLogo: currentCurrencyLogo }),
        data: productVintageRatings.map(r => {
          const { convertedPrice: priceInActiveCurrency } = convertToActiveCurrency(r.value ?? 0);

          return centsToUnits(priceInActiveCurrency);
        }),
        cubicInterpolationMode: "monotone" as const,
        borderColor: "rgba(1,1,1,1)",
        backgroundColor: "rgba(1,1,1,1)",
      },
    ],
  };

  return <Line options={options} data={data_chart} />;
};

export default VintageRatingsChart;
