import { ProductJsonldShopProductVariantReadIntensity } from "@/networking/sylius-api-client/.ts.schemas";

import styles from "./IntensityGauge.module.scss";

type Props = {
  intensity: NonNullable<ProductJsonldShopProductVariantReadIntensity>;
};

const intensityMap = {
  CLASSIQUE: 50,
  DOUX: 70,
  DOSAGE_CLASSIQUE: 40,
  FAIBLE_DOSAGE: 10,
  FRUITE: 30,
  GOURMAND: 20,
  LEGER: 10,
  LIQUOREUX: 90,
  MINERAL: 70,
  MOELLEUX: 50,
  ONCTUEUX: 20,
  PUISSANT: 90,
  SOYEUX: 30,
  VIN_MUTE: 90,
  VIF: 50,
};

const IntensityGauge = ({ intensity }: Props): JSX.Element => {
  return (
    <svg viewBox="0 0 100 4" preserveAspectRatio="none" className={styles.svg}>
      <path d="M 0,2 L 100,2" stroke="#eee" strokeWidth="1" fillOpacity="0"></path>
      <path
        d="M 0,2 L 100,2"
        stroke="rgb(101,101,101)"
        strokeWidth="4"
        fillOpacity="0"
        strokeDasharray="100, 100"
        strokeDashoffset={100 - intensityMap[intensity]}
      ></path>
    </svg>
  );
};

export default IntensityGauge;
