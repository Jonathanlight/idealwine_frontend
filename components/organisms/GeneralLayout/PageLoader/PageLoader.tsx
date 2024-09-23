import { useNProgress } from "@tanem/react-nprogress";
import clsx from "clsx";

import styles from "./PageLoader.module.scss";

type Props = { isRouteChanging: boolean };

// https://codesandbox.io/s/github/tanem/react-nprogress/tree/master/examples/next-router?file=/components/Loading.tsx
const PageLoader = ({ isRouteChanging }: Props) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: isRouteChanging,
  });

  return (
    <>
      <style jsx>{`
        .containerDynamicStyles {
          opacity: ${isFinished ? 0 : 1};
          transition-duration: ${animationDuration}ms;
        }
        .barDynamicStyles {
          margin-left: ${(-1 + progress) * 100}%;
          transition-duration: ${animationDuration}ms;
        }
      `}</style>

      <div className={clsx(styles.container, "containerDynamicStyles")}>
        <div className={clsx(styles.bar, "barDynamicStyles")}>
          <div className={styles.shadow} />
        </div>
      </div>
    </>
  );
};

export default PageLoader;
