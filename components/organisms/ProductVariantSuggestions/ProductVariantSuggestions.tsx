import Trans from "next-translate/Trans";
import { Dispatch, SetStateAction } from "react";
import { Configure, InstantSearch } from "react-instantsearch-hooks-web";

import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import {
  defaultAttributesToRetrieve,
  getDefaultAlgoliaFilter,
  searchClient,
} from "@/context/AlgoliaInstantSearchProvider";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { PLPIndexName } from "@/hooks/useAlgoliaRefinements";

import AlgoliaSuggestionsList from "../AlgoliaSuggestionsList";
import styles from "./ProductVariantSuggestions.module.scss";

const ProductVariantSuggestions = ({
  productName,
  productId,
  numberOfSuggestions,
  setNumberOfSuggestions,
  region,
}: {
  productName?: string;
  productId: number;
  numberOfSuggestions: number;
  setNumberOfSuggestions: Dispatch<SetStateAction<number>>;
  region?: string;
}) => {
  const HITS_PER_PAGE = 6;

  const { user } = useAuthenticatedUserContext();

  return (
    <>
      {numberOfSuggestions > 0 && (
        <div className={styles.suggestionsContainer}>
          <div className={styles.gridRowTitle}>
            <Trans
              ns="prix-vin"
              i18nKey="onSale"
              components={{ strong: <strong /> }}
              values={{ productName: productName ?? "" }}
            />
          </div>
          <GoldenUnderlineTitle />
          <div className={styles.algoliaSuggestionsResultsContainer}>
            <InstantSearch
              searchClient={searchClient}
              indexName={`${PLPIndexName}_bid_end_date_desc`}
            >
              <Configure
                filters={`${getDefaultAlgoliaFilter(user)} AND product = ${productId}`}
                attributesToRetrieve={defaultAttributesToRetrieve}
                hitsPerPage={HITS_PER_PAGE}
              />

              <AlgoliaSuggestionsList
                numberOfSuggestions={numberOfSuggestions}
                setNumberOfSuggestions={setNumberOfSuggestions}
                region={region}
                productName={productName}
              />
            </InstantSearch>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductVariantSuggestions;
