import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/next-router?file=/pages/_app.tsx
export const useIsRouteChanging = () => {
  const router = useRouter();

  const [state, setState] = useState({ isRouteChanging: false, loadingKey: 0 });

  useEffect(() => {
    const handleRouteChangeStart = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return;

      setState(prevState => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }));
    };

    const handleRouteChangeEnd = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return;

      setState(prevState => ({ ...prevState, isRouteChanging: false }));
    };

    const handleRouteChangeError = (err: Error, url: string, { shallow }: { shallow: boolean }) => {
      handleRouteChangeEnd(url, { shallow });
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router.events]);

  return state;
};
