import clsx from "clsx";
import { usePagination } from "react-instantsearch-hooks-web";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { AlgoliaRoute } from "@/utils/algoliaUrls";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Pagination.module.scss";

type Props = {
  filters: AlgoliaRoute;
};

const AlgoliaPagination = ({ filters }: Props) => {
  const { lang } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { pages, refine, nbPages, currentRefinement } = usePagination({ padding: 2 });

  const goToPage = (page: number) => {
    refine(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const incrementedPages = pages.map(page => page + 1);

  const hasOnlyOnePage = nbPages === 0 || nbPages === 1;
  const hideFirstPage = incrementedPages.includes(1) || nbPages === 0;
  const hideLastPage = incrementedPages.includes(nbPages) || hasOnlyOnePage;
  const hideFirst3dots = incrementedPages.includes(2) || hasOnlyOnePage;
  const hideLast3dots = incrementedPages.includes(nbPages - 1) || hasOnlyOnePage;

  const currentPage = currentRefinement + 1;

  const getPlpLink = (page: number) => {
    const params: AlgoliaRoute = { ...filters, page: [page.toString()] };

    if (page === 1) {
      delete params.page;
    }

    return getPlpUrl(params, lang);
  };

  return (
    <div className={styles.paginationContainer}>
      {!hideFirstPage && (
        <TranslatableLink
          href={getPlpLink(1)}
          dontTranslate
          onClick={e => {
            e.preventDefault();
            goToPage(1);
          }}
          className={clsx(styles.pageNumber, styles.cursorPointer)}
        >
          1
        </TranslatableLink>
      )}
      {!hideFirst3dots && <span className={styles.pageNumber}>...</span>}
      {incrementedPages.map(page => (
        <TranslatableLink
          href={getPlpLink(page)}
          dontTranslate
          key={page}
          onClick={e => {
            e.preventDefault();
            goToPage(page);
          }}
          className={clsx(
            styles.pageNumber,
            styles.cursorPointer,
            page === currentPage && styles.currentPage,
          )}
        >
          {page}
        </TranslatableLink>
      ))}
      {!hideLast3dots && <span className={styles.pageNumber}>...</span>}
      {!hideLastPage && (
        <TranslatableLink
          href={getPlpLink(nbPages)}
          dontTranslate
          onClick={e => {
            e.preventDefault();
            goToPage(nbPages);
          }}
          className={clsx(styles.pageNumber, styles.cursorPointer)}
        >
          {nbPages}
        </TranslatableLink>
      )}
    </div>
  );
};

export default AlgoliaPagination;
