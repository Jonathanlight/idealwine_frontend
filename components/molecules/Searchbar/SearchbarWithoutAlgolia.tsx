import { sendGTMEvent } from "@next/third-parties/google";
import { useRouter } from "next/router";
import { useState } from "react";

import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useTranslation } from "@/utils/next-utils";

import SearchbarUI from "./SearchbarUI";

const SearchbarWithoutAlgolia = () => {
  const { push } = useRouter();
  const [queryValue, setQueryValue] = useState("");

  const { lang } = useTranslation();

  const searchHandler = async () => {
    sendGTMEvent({
      event: "search_query",
      search_query: queryValue,
    });
    await push(getPlpUrl({ query: [queryValue] }, lang));
  };

  return (
    <SearchbarUI
      queryValue={queryValue}
      setQueryValue={setQueryValue}
      searchHandler={searchHandler}
    />
  );
};

export default SearchbarWithoutAlgolia;
