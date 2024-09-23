import React, { PropsWithChildren, useState } from "react";

import FullPageLoader from "@/components/atoms/FullPageLoader";

import { fullPageLoaderContext } from "./useFullPageLoaderContext";

const FullPageLoaderContext = ({ children }: PropsWithChildren) => {
  const [isFullPageLoaderOpen, setIsFullPageLoaderOpen] = useState(false);

  return (
    <fullPageLoaderContext.Provider value={{ setIsFullPageLoaderOpen }}>
      <FullPageLoader isLoading={isFullPageLoaderOpen} />
      {children}
    </fullPageLoaderContext.Provider>
  );
};

export default FullPageLoaderContext;
