import { useEffect } from "react";

import { useFullPageLoaderContext } from "@/context/FullPageLoaderContext/useFullPageLoaderContext";

import Paginator from "./Paginator";

type Props = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  setCurrentPage: (page: number) => void;
};

export const ITEMS_PER_PAGE = 50;
const PAGES_PADDING = 2;

export const getPagesToDisplay = (
  currentPage: number,
  nbPages: number,
  pagePadding = PAGES_PADDING,
) => {
  let startPage = Math.max(1, currentPage - pagePadding);
  let endPage = Math.min(nbPages, currentPage + pagePadding);

  if (endPage - startPage < 2 * pagePadding) {
    if (startPage === 1) {
      endPage = Math.min(nbPages, startPage + 2 * pagePadding);
    } else {
      startPage = Math.max(1, endPage - 2 * pagePadding);
    }
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

const ShopPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  isLoading,
  setCurrentPage,
}: Props) => {
  const { setIsFullPageLoaderOpen } = useFullPageLoaderContext();

  useEffect(() => {
    setIsFullPageLoaderOpen(isLoading);
  }, [isLoading, setIsFullPageLoaderOpen]);

  const nbPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayedPages = getPagesToDisplay(currentPage, nbPages);

  return (
    <Paginator
      pages={displayedPages}
      nbPages={nbPages}
      currentPage={currentPage}
      goToPage={goToPage}
    />
  );
};

export default ShopPagination;
