import { sendGTMEvent } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import { useInstantSearch, useSearchBox } from "react-instantsearch-hooks-web";

import SearchbarUI from "./SearchbarUI";

const SearchbarWithAlgolia = () => {
  const { query } = useSearchBox();
  const { setIndexUiState } = useInstantSearch();

  const [queryValue, setQueryValue] = useState(query);

  const searchHandler = () => {
    sendGTMEvent({
      event: "search_query",
      search_query: queryValue,
    });
    setIndexUiState(prevUiState => ({
      ...prevUiState,
      query: queryValue,
      refinementList: {},
    }));
  };

  useEffect(() => {
    // Reset query value when query becomes empty on clear button click
    if (query === "") setQueryValue("");
  }, [query]);

  return (
    <SearchbarUI
      queryValue={queryValue}
      setQueryValue={setQueryValue}
      searchHandler={searchHandler}
    />
  );
};

export default SearchbarWithAlgolia;
