import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import clsx from "clsx";
import Image from "next/image";

import styles from "./index.module.scss";

type WelcomeBlockProps = Content.WelcomeBlockSlice;

const WelcomeBlock = ({ slice: { primary } }: { slice: WelcomeBlockProps }): JSX.Element => (
  <div className={styles.content}>
    <Image
      src="/grapes.svg"
      alt="Icône grappe de raisin"
      className={clsx(styles.grapes, styles.dontShowOnMobile)}
      width={20}
      height={20}
    />
    <span className={styles.text}>
      <PrismicRichText field={primary.text} />
    </span>
    <Image
      src="/grapes.svg"
      alt="Icône grappe de raisin"
      className={clsx(styles.grapes, styles.dontShowOnMobile)}
      width={20}
      height={20}
    />
  </div>
);

export default WelcomeBlock;
