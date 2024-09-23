import Image from "next/image";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useTranslation } from "@/utils/next-utils";

import styles from "./MiniMapButton.module.scss";

type MiniMapButtonProps = {
  country: string;
  imageSrc: string;
  imageAlt: string;
};

const MiniMapButton = ({ country, imageSrc, imageAlt }: MiniMapButtonProps): JSX.Element => {
  const { t, lang } = useTranslation("guide-des-vins");

  return (
    <TranslatableLink
      href={getPlpUrl({ country: [country] }, lang)}
      className={styles.link}
      dontTranslate
    >
      <div className={styles.boxes}>
        <Image src={imageSrc} alt={imageAlt} width={125} height={125} className={styles.image} />
        <p className={styles.country}>{t(`countries.name.${country}`)}</p>
      </div>
    </TranslatableLink>
  );
};

export default MiniMapButton;
