import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import React from "react";
import { Radar } from "react-chartjs-2";

import { Note } from "@/utils/getTastingNotesUtils";

import styles from "./TastingNotesChart.module.scss";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const GOLDEN = "rgb(167 129 61)";
const GREY = "rgb(20, 20, 20, 0.2)";

const TastingNotesChart = ({ notes }: { notes: Note[] }) => {
  const options = {
    scale: {
      min: 0,
      max: 100,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        ticks: {
          display: false,
        },
      },
    },
  };
  const data = {
    labels: notes.map(({ label }) => label),
    datasets: [
      {
        data: notes.map(({ note }) => note),
        backgroundColor: GREY,
        borderColor: GOLDEN,
        borderWidth: 2,
        pointBackgroundColor: GOLDEN,
      },
    ],
  };

  return (
    <div className={styles.notesGraphContainer}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default TastingNotesChart;
