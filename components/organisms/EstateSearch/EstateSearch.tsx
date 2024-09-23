import { faMagnifyingGlass } from "@fortawesome/pro-solid-svg-icons/faMagnifyingGlass";
import { faMinus } from "@fortawesome/pro-thin-svg-icons/faMinus";
import { faPlus } from "@fortawesome/pro-thin-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";

import Input from "@/components/atoms/Input";
import {
  getGetNamesEstateCollectionQueryKey,
  getNamesEstateCollection,
} from "@/networking/sylius-api-client/estate/estate";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";

import EstateBox from "./EstateBox";
import styles from "./EstateSearch.module.scss";

const EstateSearch = () => {
  const [estateContainerOpen, setEstateContainerOpen] = useState(false);
  const [searchbarText, setSearchbarText] = useState("");

  const { t } = useTranslation("guide-des-vins");

  const { data: estates } = useQuery(getEstateNamesCollectionQueryParams());

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  return (
    <>
      <Input
        type="text"
        rightIcon={faMagnifyingGlass}
        inputClassName={styles.searchInput}
        placeholder={t("search-domain")}
        value={searchbarText}
        onChange={event => setSearchbarText(event.target.value)}
      />
      <div
        className={clsx(
          styles.estateBoxesContainer,
          !estateContainerOpen && styles.scrollableContainer,
        )}
      >
        {estates?.["hydra:member"]
          ?.filter(estate =>
            removeAccents((estate.name ?? "").toLocaleLowerCase()).includes(
              removeAccents(searchbarText.toLocaleLowerCase()),
            ),
          )
          ?.map(estate => (
            <EstateBox key={estate.id} estate={estate} estateQuery={searchbarText} />
          ))}
      </div>
      <button
        className={styles.showAllButton}
        onClick={() => setEstateContainerOpen(!estateContainerOpen)}
      >
        <FontAwesomeIcon icon={estateContainerOpen ? faMinus : faPlus} size="lg" />
      </button>
    </>
  );
};

export const getEstateNamesCollectionQueryParams = () => ({
  staleTime: STALE_TIME_HOUR,
  queryKey: getGetNamesEstateCollectionQueryKey(),
  queryFn: () => getNamesEstateCollection(),
});

export default EstateSearch;
