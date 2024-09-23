import type { Content } from "@prismicio/client";
import { asLink } from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import Head from "next/head";

import Button from "@/components/atoms/Button/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram } from "@/networking/sylius-api-client/.ts.schemas";

import styles from "./index.module.scss";

type GroupedThreeBlocksBannerProps = Content.GroupedThreeBlockBannerSlice;

const GroupedThreeBlocksBanner = ({
  slice: { primary },
}: {
  slice: GroupedThreeBlocksBannerProps;
}) => {
  const { user } = useAuthenticatedUserContext();
  const isLoyaltyProgramQuintessence =
    user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.QUINTESSENCE;

  return (
    <>
      {isLoyaltyProgramQuintessence && (
        <Head>
          <link rel="stylesheet" href="https://use.typekit.net/qea1cff.css" />
        </Head>
      )}
      <section className={styles.section}>
        <p className={styles.title}>{primary.title}</p>

        <div
          className={`${
            isLoyaltyProgramQuintessence ? styles.contentQuintessence : styles.noQuintessence
          }`}
        >
          {isLoyaltyProgramQuintessence && (
            <div className={clsx(styles.quintessenceBlock, styles.relativePosition)}>
              <TranslatableLink href={asLink(primary.linkimage4) ?? "/"} dontTranslate={true}>
                <div className={styles.imageDiv}>
                  <PrismicNextImage
                    priority
                    field={primary.image4}
                    fill
                    className={styles.image}
                    imgixParams={{ auto: ["format"] }}
                  />
                </div>
                <p
                  className={clsx(
                    styles.imageTitle,
                    styles.absolutePosition,
                    styles.titleSmallBlocks,
                    styles.titlefont,
                  )}
                >
                  {primary.textimage4}
                </p>
                <Button className={clsx(styles.button, styles.absolutePosition)}>
                  {primary.textbuttonimage4}
                </Button>
              </TranslatableLink>
            </div>
          )}
          <div className={clsx(styles.firstImageBlock, styles.relativePosition)}>
            <TranslatableLink href={asLink(primary.linkimage1) ?? "/"} dontTranslate={true}>
              <div className={styles.imageDiv}>
                <PrismicNextImage
                  priority
                  field={primary.image1}
                  fill
                  className={styles.image}
                  imgixParams={{ auto: ["format"] }}
                />
              </div>
              <p
                className={clsx(
                  styles.imageTitle,
                  styles.absolutePosition,
                  styles.titleSmallBlocks,
                )}
              >
                {primary.textimage1}
              </p>
              <Button
                className={clsx(styles.button, styles.absolutePosition)}
                variant="primaryWhite"
              >
                {primary.textbuttonimage1}
              </Button>
            </TranslatableLink>
          </div>
          <div className={clsx(styles.secondImageBlock, styles.relativePosition)}>
            <TranslatableLink href={asLink(primary.linkimage2) ?? "/"} dontTranslate={true}>
              <div className={styles.imageDiv}>
                <PrismicNextImage
                  priority
                  field={primary.image2}
                  fill
                  className={styles.image}
                  imgixParams={{ auto: ["format"] }}
                />
              </div>
              <p
                className={clsx(
                  styles.imageTitle,
                  styles.absolutePosition,
                  styles.titleSmallBlocks,
                )}
              >
                {primary.textimage2}
              </p>

              <Button
                className={clsx(styles.button, styles.absolutePosition)}
                variant="primaryWhite"
              >
                {primary.textbuttonimage2}
              </Button>
            </TranslatableLink>
          </div>
          <div className={clsx(styles.thirdImageBlock, styles.relativePosition)}>
            <TranslatableLink href={asLink(primary.linkimage3) ?? "/"} dontTranslate={true}>
              <div className={styles.imageDiv}>
                <PrismicNextImage
                  priority
                  field={primary.image3}
                  fill
                  className={styles.image}
                  imgixParams={{ auto: ["format"] }}
                />
              </div>
              <p
                className={clsx(
                  styles.imageTitle,
                  styles.absolutePosition,
                  styles.titleLargeBlocks,
                )}
              >
                {primary.textimage3}
              </p>
              <Button
                className={clsx(styles.roundedButton, styles.absolutePosition)}
                variant="primaryBlack"
              >
                {primary.textbuttonimage3}
              </Button>
            </TranslatableLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default GroupedThreeBlocksBanner;
