import { useDebouncedCallback } from "@react-hookz/web";
import { ChangeEvent } from "react";
import { useRefinementList } from "react-instantsearch-hooks-web";

import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import { SEARCH_INPUT_DEBOUNCE_IN_MS } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./FilterContent.module.scss";

export const FilterContent = ({
  algoliaList,
  translationLabel,
  name,
}: {
  algoliaList: ReturnType<typeof useRefinementList>;
  translationLabel?: string | null;
  name?: string;
}): JSX.Element => {
  const { t } = useTranslation(`acheter-du-vin`);

  const onType = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => algoliaList.searchForItems(event.target.value),
    [algoliaList],
    SEARCH_INPUT_DEBOUNCE_IN_MS,
  );

  return (
    <>
      {isNotNullNorUndefined(name) && <div className={styles.filterSubTitle}>{name}</div>}
      {(algoliaList.canToggleShowMore || algoliaList.isFromSearch) && (
        <Input
          type="text"
          onChange={onType}
          placeholder={t("search")}
          className={styles.searchInput}
        />
      )}
      <div className={styles.scrollableItems}>
        {algoliaList.items.length === 0 && (
          <div className={styles.smallItalic}>{t(`noResult`)}</div>
        )}
        <ul>
          {algoliaList.items.map(item => (
            <li key={item.value} className={styles.filterItem}>
              <Input
                label={
                  isNotNullNorUndefined(translationLabel)
                    ? `${t(`${translationLabel}.${item.label}`)} (${item.count})`
                    : `${item.label} (${item.count})`
                }
                type="checkbox"
                onChange={() => algoliaList.refine(item.value)}
                checked={item.isRefined}
              />
            </li>
          ))}
        </ul>
        {algoliaList.isShowingMore &&
          !algoliaList.hasExhaustiveItems &&
          !algoliaList.isFromSearch && (
            <div className={styles.smallItalic}>{t(`useSearchBar`)}</div>
          )}
        {algoliaList.canToggleShowMore && (
          <Button
            variant="inline"
            className={styles.smallItalic}
            onClick={() => algoliaList.toggleShowMore()}
          >
            {algoliaList.isShowingMore ? t("showLess") : t(`showMore`)}
          </Button>
        )}
      </div>
    </>
  );
};
