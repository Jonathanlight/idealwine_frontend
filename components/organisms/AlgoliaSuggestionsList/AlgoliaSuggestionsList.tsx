import { Dispatch, SetStateAction } from "react";
import { useHits, useInstantSearch } from "react-instantsearch-hooks-web";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useTranslation } from "@/utils/next-utils";

import { AlgoliaHitType } from "../PLP/AlgoliaHit/AlgoliaHitType";
import ProductCard from "../PLP/ProductCard";
import styles from "./AlgoliaSuggestionsList.module.scss";

const HITS_PER_PAGE = 6;

const AlgoliaSuggestionsList = ({
  setNumberOfSuggestions,
  numberOfSuggestions,
  region,
  productName,
}: {
  setNumberOfSuggestions: Dispatch<SetStateAction<number>>;
  numberOfSuggestions: number;
  region?: string;
  productName?: string;
}) => {
  const { hits } = useHits<AlgoliaHitType>();
  const { results } = useInstantSearch();
  const { lang } = useTranslation();
  if (!results.__isArtificial && results.nbHits !== numberOfSuggestions) {
    setNumberOfSuggestions(results.nbHits);
  }

  return (
    <ul className={styles.hitsList}>
      {hits.map(hit => (
        <ProductCard key={hit.objectID} product={hit} preloadPicture={false} />
      ))}
      {numberOfSuggestions > HITS_PER_PAGE && (
        <TranslatableLink
          href={getPlpUrl({ region: [region], query: [productName] }, lang)}
          className={styles.link}
          dontTranslate
        >
          <label htmlFor="expandVintagesGridButton" className={styles.moreProductsCross}>
            <button className={styles.buttonUnClicked} id="linkToPlpFilteredByEstate">
              ✕
            </button>
          </label>
        </TranslatableLink>
      )}
    </ul>
  );
};
export default AlgoliaSuggestionsList;
