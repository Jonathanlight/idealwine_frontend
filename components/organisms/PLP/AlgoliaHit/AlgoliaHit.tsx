import ProductCard from "../ProductCard";
import styles from "./AlgoliaHit.module.scss";
import { AlgoliaHitType } from "./AlgoliaHitType";

type Props = {
  hit: AlgoliaHitType;
  preloadPicture: boolean;
};

const AlgoliaHit = ({ hit, preloadPicture }: Props): JSX.Element => {
  return (
    <ProductCard
      product={hit}
      className={styles.productCard}
      preloadPicture={preloadPicture}
      fromPLP={true}
    />
  );
};

export default AlgoliaHit;
