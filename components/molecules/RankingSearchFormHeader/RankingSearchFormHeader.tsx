import Image from "next/image";

import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";

import styles from "./RankingSearchFormHeader.module.scss";

type Props = {
  image: string;
  alt: string;
  title: string;
  underTitle: string;
};

const RankingSearchFormHeader = ({ image, alt, title, underTitle }: Props) => {
  return (
    <div className={styles.rankingSearchFormHeader}>
      <Image src={image} alt={alt} width={100} height={100} />
      <div className={styles.ratingRankingSearchFormTitle}>{title}</div>
      <div className={styles.ratingRankingSearchFormUnderTitle}>{underTitle}</div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default RankingSearchFormHeader;
