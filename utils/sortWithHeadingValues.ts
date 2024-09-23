import { UseRefinementListProps } from "react-instantsearch-hooks-web";

type AlgoliaSort = Exclude<UseRefinementListProps["sortBy"], undefined | string[]>;

export const sortWithHeadingValues =
  (headingValues: string[]): AlgoliaSort =>
  (a, b) => {
    if (a.isRefined && !b.isRefined) return -1;
    if (!a.isRefined && b.isRefined) return 1;

    if (headingValues.includes(a.name) && headingValues.includes(b.name)) {
      return headingValues.indexOf(a.name) - headingValues.indexOf(b.name);
    }

    if (headingValues.includes(a.name)) {
      return -1;
    }

    if (headingValues.includes(b.name)) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  };
