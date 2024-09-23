import clsx from "clsx";
import Trans from "next-translate/Trans";
import Image from "next/image";

import styles from "./Bookmark.module.scss";

type Props = {
  imageSrc: string;
  title: string;
  subtitle: string;
  program: "quintessence" | "ideal" | "privilege" | "classique";
  advantages: string[];
};

const Bookmark = ({ imageSrc, title, subtitle, program, advantages }: Props) => {
  return (
    <div className={styles.boxAdvantages}>
      <div
        className={clsx(
          styles.boxHeader,
          styles[program],
          program === "quintessence" ? styles.backgroundAntiqueWhite : styles.backgroundNavy,
        )}
      >
        <Image className={styles.programLogo} src={imageSrc} alt={title} width={120} height={120} />
        <h3 className={styles.titleBookmark}>{title}</h3>
        <p className={styles.subtitleBookmark}>{subtitle}</p>
      </div>
      <ul className={styles.listAdvantages}>
        {advantages.map((element, index) => {
          return (
            <li key={index} className={styles.advantagesItem}>
              <div>
                {element === "-" ? (
                  element
                ) : (
                  <Trans
                    ns="programme-idealwine"
                    i18nKey={`${program}.advantages.advantage${index + 1}`}
                    components={[<sup key={index} />]}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Bookmark;
