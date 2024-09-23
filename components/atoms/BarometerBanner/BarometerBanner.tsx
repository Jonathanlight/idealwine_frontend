import Image from "next/image";

import { useTranslation } from "@/utils/next-utils";

import TranslatableLink from "../TranslatableLink";
import styles from "./BarometerBanner.module.scss";

type Props = {
  variant: "auctions" | "fine-spirits";
};

const traductionKeys = {
  auctions: "loyaltyProgramMenu.readAuctionsBarometer",
  "fine-spirits": "loyaltyProgramMenu.readFSABarometer",
} as const;

const imageSrcsTraductionKey = {
  auctions: "idwBarometerImage",
  "fine-spirits": "fsaBarometerImage",
};

const linkDestination = {
  auctions: "BAROMETER",
  "fine-spirits": "BAROMETER_FSA",
};

const splitTextIntoLines = (text: string) => {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span key={word}>
      {word + " "}
      {(index + 1) % 3 === 0 && <br />}
    </span>
  ));
};

const BarometerBanner = ({ variant }: Props) => {
  const { t } = useTranslation("accueil-profil");
  const text = t(traductionKeys[variant]);
  const textWithLineBreaks = splitTextIntoLines(text);

  return (
    <TranslatableLink href={linkDestination[variant]} className={styles.mainContainer}>
      <div className={styles.textContainer}>
        <span className={styles.text}>{textWithLineBreaks}</span>
      </div>
      <Image
        src={t(imageSrcsTraductionKey[variant])}
        alt="iDealwine's barometer"
        width={variant === "fine-spirits" ? 314 : 227}
        height={variant === "auctions" ? 165 : 200}
        className={styles.image}
      />
    </TranslatableLink>
  );
};

export default BarometerBanner;
