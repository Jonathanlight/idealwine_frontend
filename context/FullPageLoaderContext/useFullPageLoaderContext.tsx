import { createContext, useContext } from "react";

interface FullPageLoader {
  setIsFullPageLoaderOpen: (isFullPageLoaderOpen: boolean) => void;
}

export const fullPageLoaderContext = createContext<FullPageLoader>({
  setIsFullPageLoaderOpen: () => {},
});

export const useFullPageLoaderContext = () => useContext(fullPageLoaderContext);
