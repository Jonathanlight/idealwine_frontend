import Image from "next/image";
import React from "react";

import { getTransP } from "@/components/atoms/TransP";

import styles from "./CellarStaffCard.module.scss";

type Props = {
  imageSrc: string;
  alt: string;
  descriptionKey: string;
};

const CellarStaffCard = ({ imageSrc, alt, descriptionKey }: Props) => {
  const TransP = getTransP("cave-sur-mesure");

  return (
    <div className={styles.box}>
      <Image src={imageSrc} alt={alt} width={250} height={383} />
      <TransP className={styles.description} i18nKey={descriptionKey} />
    </div>
  );
};

export default CellarStaffCard;
