import { PrismicNextImage } from "@prismicio/next";
import { PrismicLink, PrismicRichText } from "@prismicio/react";
import { ImageField, LinkField, RichTextField } from "@prismicio/types";
import clsx from "clsx";

import LinkButton from "@/components/atoms/Button/LinkButton";
import TranslatableLink from "@/components/atoms/TranslatableLink";

import styles from "./Card.module.scss";

type Link = {
  url: string;
};

const defensiveGetUrl = (link: LinkField | undefined): string | undefined => {
  const typedLink = link as Link | undefined;

  return typedLink ? typedLink.url : undefined;
};

type Props = {
  className?: string;
  header?: string;
  image?: ImageField;
  imageLabel?: string;
  linkLabel?: string;
  link?: LinkField;
  secondLinkLabel?: string;
  secondLink?: LinkField;
  title?: RichTextField;
  buttonColor?:
    | "primaryGolden"
    | "secondaryGolden"
    | "primaryBlack"
    | "primaryWhite"
    | "secondaryBlack"
    | "secondaryWhite"
    | "inline";
};

const Card = ({
  className,
  image,
  imageLabel = "",
  linkLabel,
  link,
  header,
  title,
  secondLink,
  secondLinkLabel,
  buttonColor,
}: Props): JSX.Element => {
  return (
    <div className={clsx(styles.cardContainer, className)}>
      <div className={styles.imageContainer}>
        <TranslatableLink
          className={styles.image}
          href={defensiveGetUrl(link) ?? ""}
          aria-label={imageLabel}
          dontTranslate
        >
          <PrismicNextImage
            field={image}
            fill
            className={styles.image}
            priority
            imgixParams={{ auto: ["format"] }}
          />
        </TranslatableLink>
      </div>
      <div className={styles.textContainer}>
        <div className={styles.descriptionContainer}>
          <div className={clsx(styles.header, styles.text)}>{header}</div>
          <div className={clsx(styles.title, styles.text)}>
            <PrismicRichText field={title} />
          </div>
          {secondLinkLabel !== undefined && secondLinkLabel !== "" && (
            <PrismicLink className={styles.secondLink} field={secondLink}>
              {secondLinkLabel}
            </PrismicLink>
          )}
        </div>
        <div className={styles.linkContainer}>
          <LinkButton
            className={styles.link}
            variant={buttonColor}
            href={defensiveGetUrl(link) ?? ""}
            aria-label={linkLabel}
            dontTranslate
          >
            {linkLabel}
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default Card;
