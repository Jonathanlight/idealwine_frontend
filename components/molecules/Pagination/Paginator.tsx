import clsx from "clsx";

import styles from "./Pagination.module.scss";

type Props = {
  pages: number[];
  nbPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
};

const Paginator = ({ pages, nbPages, currentPage, goToPage }: Props) => {
  const hasOnlyOnePage = nbPages === 0 || nbPages === 1;
  const hideFirstPage = pages.includes(1) || nbPages === 0;
  const hideLastPage = pages.includes(nbPages) || hasOnlyOnePage;
  const hideFirst3dots = pages.includes(2) || hasOnlyOnePage;
  const hideLast3dots = pages.includes(nbPages - 1) || hasOnlyOnePage;

  return (
    <div className={styles.paginationContainer}>
      {!hideFirstPage && (
        <button
          onClick={() => goToPage(1)}
          className={clsx(styles.pageNumber, styles.cursorPointer)}
        >
          1
        </button>
      )}
      {!hideFirst3dots && <span className={styles.pageNumber}>...</span>}
      {pages.map(page => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={clsx(
            styles.pageNumber,
            styles.cursorPointer,
            page === currentPage && styles.currentPage,
          )}
        >
          {page}
        </button>
      ))}
      {!hideLast3dots && <span className={styles.pageNumber}>...</span>}
      {!hideLastPage && (
        <button
          onClick={() => goToPage(nbPages)}
          className={clsx(styles.pageNumber, styles.cursorPointer)}
        >
          {nbPages}
        </button>
      )}
    </div>
  );
};
export default Paginator;
