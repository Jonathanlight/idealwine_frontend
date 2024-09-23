import { sendGTMEvent } from "@next/third-parties/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

const usePageViewTracking = () => {
  const { asPath } = useRouter();

  useEffect(() => {
    sendGTMEvent({ event: "page_view", page_path: asPath });
  }, [asPath]);
};

export const PageViewTracking = () => {
  usePageViewTracking();

  return null;
};
