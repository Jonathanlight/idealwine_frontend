import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import FullScreenImage from "@/components/molecules/FullScreenImage";
import SlidingCarousel from "@/components/organisms/SlidingCarousel/SlidingCarousel";
import { CarrouselSlideType, SlideToCarousel } from "@/components/organisms/SlidingCarousel/utils";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("a-propos-d-idealwine");
  const [fullScreen, setFullScreen] = useState(false);
  const [fullScreenImagePath, setFullScreenImagePath] = useState("/cadreteam.jpg");

  const slidesCarousel: SlideToCarousel[] = [
    {
      type: CarrouselSlideType.youtubeVideo,
      src: t("youtubevideoPrez"),
      description: t("video2.title"),
      poster: "/about-us/IDWVideo1-poster.jpg",
    },
    {
      type: CarrouselSlideType.youtubeVideo,
      src: t("youtubevideoInterview"),
      poster: "/team.jpg",
    },
    {
      type: CarrouselSlideType.youtubeVideo,
      src: t("youtubevideoVendre"),
      description: t("video3.title"),
      poster: "/about-us/IDWVideo2-poster.jpg",
    },
    {
      type: CarrouselSlideType.youtubeVideo,
      src: t("youtubevideoWinedex"),
      description: t("video4.title"),
      poster: "/about-us/IDWVideo3-poster.jpg",
    },
  ];

  const people = [
    { urlSmall: "/team-S1.jpg", urlLarge: "/team-L1.jpg", description: t("li1") },
    { urlSmall: "/team-S2.jpg", urlLarge: "/team-L2.jpg", description: t("li2") },
    { urlSmall: "/team-S3.jpg", urlLarge: "/team-L3.jpg", description: t("li3") },
    { urlSmall: "/team-S4.jpg", urlLarge: "/team-L4.jpg", description: t("li4") },
    { urlSmall: "/team-S5.jpg", urlLarge: "/team-L5.jpg", description: t("li5") },
    { urlSmall: "/team-S6.jpg", urlLarge: "/team-L6.jpg", description: t("li6") },
    { urlSmall: "/team-S7.jpg", urlLarge: "/team-L7.jpg", description: t("li7") },
    { urlSmall: "/team-S8.jpg", urlLarge: "/team-L8.jpg", description: t("li8") },
    { urlSmall: "/team-S9.jpg", urlLarge: "/team-L9.jpg", description: t("li9") },
  ];

  const peopleList = people.map((person, index) => <li key={index}>{person.description}</li>);

  const imagesList = people.map(team => (
    <div key={team.urlSmall} className={styles.imgBlock}>
      <Image
        className={styles.imgTeam}
        width={500}
        height={301}
        src={team.urlSmall}
        alt={team.description}
        onClick={() => {
          setFullScreenImagePath(team.urlLarge);
          setFullScreen(true);
        }}
      />
      <span className={styles.item}>{team.description}</span>
    </div>
  ));

  useMountEffect(() => {
    sendGTMEvent({
      page: "a_propos",
      pageChapter1: "corporate",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <video className={clsx(styles.videoBg, styles.sepia)} autoPlay muted loop>
        <source src="/about-us/video-background-about-us.mp4" type="video/mp4" />
      </video>
      <div className={styles.flex}>
        <Image
          className={clsx(styles.sepia, styles.dontShowOnMobileOrTablet)}
          priority
          src="/founders2.png"
          width={572}
          height={456}
          alt="Photo des founders"
        />
        <div>
          <h1 className={styles.h1}>{t("title")}</h1>
          <h2 className={styles.h2}>{t("subtitle")}</h2>
        </div>
      </div>
      <div className={styles.wrapper}>
        <section>
          <div className={styles.goldspace}>
            <h3 className={styles.gold}>{t("whoAreWe")}</h3>
            <p>{t("whoAreWeContent")}</p>
          </div>
        </section>
        <section className={styles.pageContainer}>
          <article className={styles.banner}>
            <Image src="/valeurs.jpg" width={600} height={400} alt="valeurs" />
            <div>
              <h3 className={styles.gold}>{t("values.title")}</h3>
              <p>{t("values.content")}</p>
            </div>
          </article>
        </section>
        <section className={styles.pageContainer}>
          <div className={styles.team}>
            <div>
              <h3 className={clsx(styles.title, styles.gold)}>{t("weAreIdealwine")}</h3>
              <h4 className={styles.title}>{t("iDealwineTeam.titleArticle")}</h4>
              <p>{t("iDealwineTeam.contentArticle")}</p>
              <ol className={styles.list}>{peopleList}</ol>
            </div>

            {fullScreen && (
              <FullScreenImage onClose={() => setFullScreen(false)}>
                <Image
                  onClick={() => setFullScreen(true)}
                  src={fullScreenImagePath}
                  alt={t("altteam")}
                  width={1200}
                  height={800}
                  className={styles.full}
                />
              </FullScreenImage>
            )}
            <div className={styles.teamgrid}>{imagesList}</div>
          </div>
        </section>

        <section className={clsx(styles.pageContainer, styles.grid)}>
          <article className={styles.banner2}>
            <Image src="/rvf.jpg" width={200} height={200} alt="rvf" className={styles.sepia} />
            <cite className={styles.cite}>{t("press1.content")}</cite>
            <small>
              <span>{t("press1.author")}</span>
            </small>
          </article>

          <article className={clsx(styles.relative, styles.banner2)}>
            <h3 className={clsx(styles.h3, styles.gold)}>{t("whatPressSaysAboutUs")} </h3>

            <Image src="/gazette.jpg" alt="altgazette" width={535} height={450} />
            <a className={styles.absolute} href={t("linkblog")}>
              <Button variant="primaryGolden" className={styles.absolute}>
                {t("textButtonPress")}
              </Button>
            </a>
          </article>
          <article className={styles.banner2}>
            <Image
              className={styles.sepia}
              src="/db.jpg"
              width={200}
              height={200}
              alt="Drink business"
            />

            <cite className={styles.cite}>{t("press2.content")}</cite>
            <small>
              <span>{t("press2.author")}</span>
              <span>{t("press2.authorTitle")}</span>
            </small>
          </article>
        </section>

        <section className={clsx(styles.pageContainer, styles.bglarge)}>
          <div className={clsx(styles.banner2, styles.video)}>
            <h3 className={styles.gold}>{t("videosTitle")}</h3>
            <SlidingCarousel slides={slidesCarousel} width={900} height={600} />
          </div>
        </section>
        <section className={clsx(styles.pageContainer, styles.gridx3)}>
          <article className={styles.goldspace}>
            <div>
              <strong className={styles.strong}>{t("article1OurCompanies.title")}</strong>
              <p>{t("article1OurCompanies.content")}</p>
            </div>
          </article>
          <article className={styles.goldspace}>
            <div>
              <strong className={styles.strong}>{t("article2OurCompanies.title")}</strong>
              <p>{t("article2OurCompanies.content")}</p>
            </div>
          </article>
          <article className={styles.goldspace}>
            <div>
              <strong className={styles.strong}> {t("article3OurCompanies.title")}</strong>
              <p>{t("article3OurCompanies.content")}</p>
            </div>
          </article>
        </section>
        <section className={styles.pageContainer}>
          <div>
            <h3 className={clsx(styles.gold, styles.h3)}>{t("whatClientsSayAboutUs")}</h3>
            {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
            <iframe
              id="AV_widget_iframe"
              frameBorder="0"
              width="100%"
              height="100%"
              src={t("avis")}
            />
          </div>
        </section>
        <section className={clsx(styles.pageContainer, styles.gridx3)}>
          <Button variant="primaryGolden">
            <TranslatableLink href="BUY_WINE_URL">{t("button1")}</TranslatableLink>
          </Button>
          <Button variant="primaryGolden">
            <TranslatableLink href="FAQ_URL">{t("button2")}</TranslatableLink>
          </Button>
          <Button variant="primaryGolden">
            <a href={t("recruitment_url")}> {t("button3")}</a>
          </Button>
        </section>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
