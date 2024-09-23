import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

import styles from "./index.module.scss";

type IndicesProps = Content.IndicesSlice;

const Indices = ({ slice: { primary } }: { slice: IndicesProps }) => {
  const getWhiteBarStylesFromPercentage = (percentage: number) => {
    return {
      position: "absolute",
      right: "0",
      width: `${30 - percentage}%`,
      backgroundColor: "white",
      zIndex: "-1",
      height: "100%",
      justifyContent: "end",
    } as React.CSSProperties;
  };

  const printNumber = (number: number) => {
    return `${number > 0 ? `+${number}` : number}%`;
  };

  return (
    <section>
      <div className={styles.title}>
        <PrismicRichText field={primary.title} />
        <PrismicRichText field={primary.description} />
      </div>
      <div className={styles.indiceContainer}>
        <div className={styles.indice}>
          <div className={styles.gradientStyle} />{" "}
          <div style={getWhiteBarStylesFromPercentage(Number(primary.indice100))} />
          <div className={styles.indiceText}>
            <PrismicRichText field={primary.indice100text} />
            <p className={styles.percentage}>{printNumber(Number(primary.indice100))}</p>
          </div>
        </div>
        <div className={styles.indice}>
          <div className={styles.gradientStyle} />{" "}
          <div style={getWhiteBarStylesFromPercentage(Number(primary.indicebordeaux))} />
          <div className={styles.indiceText}>
            <PrismicRichText field={primary.indicebordeauxtext} />
            <p className={styles.percentage}>{printNumber(Number(primary.indicebordeaux))}</p>
          </div>
        </div>
        <div className={styles.indice}>
          <div className={styles.gradientStyle} />{" "}
          <div style={getWhiteBarStylesFromPercentage(Number(primary.indicebourgogne))} />
          <div className={styles.indiceText}>
            <PrismicRichText field={primary.indicebourgognetext} />
            <p className={styles.percentage}>{printNumber(Number(primary.indicebourgogne))}</p>
          </div>
        </div>
        <div className={styles.indice}>
          <div className={styles.gradientStyle} />{" "}
          <div style={getWhiteBarStylesFromPercentage(Number(primary.indicerhone))} />
          <div className={styles.indiceText}>
            <PrismicRichText field={primary.indicerhonetext} />
            <p className={styles.percentage}>{printNumber(Number(primary.indicerhone))}</p>
          </div>
        </div>
        <div className={styles.indice}>
          <div className={styles.gradientStyle} />{" "}
          <div style={getWhiteBarStylesFromPercentage(Number(primary.cac40))} />
          <div className={styles.indiceText}>
            <PrismicRichText field={primary.cac40text} />
            <p className={styles.percentage}>{printNumber(Number(primary.cac40))}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Indices;
