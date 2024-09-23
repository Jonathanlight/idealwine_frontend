/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useClickOutside } from "@react-hookz/web";
import { SearchClient } from "algoliasearch";
import algoliasearch from "algoliasearch/lite";
import { useRef, useState } from "react";
import { Configure, Hits, InstantSearch } from "react-instantsearch-hooks-web";

import { vintageRatingIndexName } from "@/hooks/useAlgoliaRefinements";

import EmptyQueryBoundary from "../AlgoliaAutocomplete/EmptyQueryBoundary";
import CustomSearchBox from "../CustomSearchBox/CustomSearchBox";
import VintageRatingAlgoliaHit from "../VintageRatingAlgoliaHit";

type Props = {
  searchBoxStyles?: { [key: string]: string };
  hitsStyle?: string;
  placeholder: string;
  onClickCallback?: () => void;
};

const HITS_PER_PAGE = 50;
const ALGOLIA_RATING_SEARCH_TRESHOLD = 4;

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "",
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? "",
);

const searchClient = {
  search: requests => {
    const query = requests[0]?.params?.query;
    const shouldSearch =
      query !== undefined && query !== "" && query.length >= ALGOLIA_RATING_SEARCH_TRESHOLD;
    if (shouldSearch) {
      return algoliaClient.search(requests);
    }

    return Promise.resolve({
      results: [{ hits: [] }],
    });
  },
  searchForFacetValues: algoliaClient.searchForFacetValues,
} as SearchClient;

const AlgoliaRatingInstantSearch = ({
  searchBoxStyles,
  hitsStyle,
  placeholder,
  onClickCallback,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  useClickOutside(searchRef, () => setIsFocused(false), ["mousedown"]);

  return (
    <div ref={searchRef}>
      <InstantSearch searchClient={searchClient} indexName={vintageRatingIndexName}>
        <Configure hitsPerPage={HITS_PER_PAGE} />
        <CustomSearchBox
          classNames={searchBoxStyles}
          setIsFocused={setIsFocused}
          placeholder={placeholder}
        />
        <div style={{ display: isFocused ? "block" : "none" }}>
          <EmptyQueryBoundary fallback={null}>
            <Hits
              hitComponent={VintageRatingAlgoliaHit({
                onClick: () => {
                  setIsFocused(false);
                  onClickCallback?.();
                },
              })}
              className={hitsStyle}
            />
          </EmptyQueryBoundary>
        </div>
      </InstantSearch>
    </div>
  );
};

export default AlgoliaRatingInstantSearch;
