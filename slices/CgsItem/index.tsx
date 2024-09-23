import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

import styles from "./index.module.scss";

type CgsItemProps = Content.CgsItemSlice;

const CgsItem = ({ slice: { primary } }: { slice: CgsItemProps }): JSX.Element => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className={styles.content}>
      <button
        onClick={() => setIsOpened(!isOpened)}
        className={clsx(styles.titleBox, isOpened && styles.opened)}
      >
        <p>{primary.title}</p>
        <Image
          className={clsx(styles.chevron, !isOpened && styles.displayNone)}
          src={"/chevron.svg"}
          alt="Fermer l'onglet"
          height={25}
          width={25}
        />
      </button>
      <div className={clsx(styles.description, !isOpened && styles.displayNone)}>
        <PrismicRichText
          field={primary.description}
          components={{
            paragraph: ({ children }) => <p className={styles.paragraph}>{children}</p>,
          }}
        />
      </div>
    </div>
  );
};

export default CgsItem;
