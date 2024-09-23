import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
/* eslint-disable react/no-unescaped-entities */
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { useKeenSlider } from "keen-slider/react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image from "next/image";
import React from "react";

import Button from "@/components/atoms/Button";
import LinkButton from "@/components/atoms/Button/LinkButton";
import Title from "@/components/atoms/Title/Title";
import { getTransP } from "@/components/atoms/TransP";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getTranslatedHref } from "@/urls/linksTranslation";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import "keen-slider/keen-slider.min.css";
import styles from "./index.module.scss";

const TransP = getTransP("vendre-mes-vins");

const Page = () => {
  const { t, lang } = useTranslation("vendre-mes-vins");

  const freeEstimateFormUrl = getTranslatedHref("FREE_WINE_ESTIMATION_URL", lang);

  const questionKeys = [
    { question: "question1" },
    { question: "question2" },
    {
      question: "question3",
      params: {
        priceEstimateUrl: getTranslatedHref("VINTAGE_RATING_URL", lang),
      },
    },
    { question: "question4" },
    { question: "question5" },
    { question: "question6" },
    { question: "question7" },
    { question: "question8" },
    { question: "question9" },
    { question: "question10" },
    { question: "question11" },
    { question: "question12" },
    { question: "question13" },
    { question: "question14" },
    { question: "question15" },
    { question: "question16" },
    { question: "question17" },
    { question: "question18" },
  ];

  const [sliderRef] = useKeenSlider(
    {
      loop: true,

      breakpoints: {
        "(max-width: 1000px)": {
          slides: {
            perView: 1,
            spacing: 0,
          },
        },
        "(min-width: 1100px)": {
          slides: {
            perView: 3,
            spacing: 0,
          },
        },
      },
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 3000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ],
  );

  useMountEffect(() => {
    sendGTMEvent({
      page: "accueil_vendre",
      pageChapter1: "vendre_mes_vins",
      pageChapter2: "",
    });
  });

  return (
    <>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={t("meta")} />
      </Head>

      <div className={styles.largewrapper}>
        <div>
          <div className={styles.bg}>
            <Title level="h1">{t("h1")}</Title>
            <h2 className={styles.h2}>{t("h2")}</h2>
            <div className={styles.slider}>
              <div ref={sliderRef} className="keen-slider">
                <div className={clsx("keen-slider__slide", styles.fix)}>
                  <p className={styles.custom}>
                    <strong className={styles.strong}>40</strong>
                    {t("slide1")}
                  </p>
                </div>
                <div className={clsx("keen-slider__slide", styles.fix)}>
                  <p className={styles.custom}>
                    <strong className={styles.strong}>{t("first")}</strong>
                    {t("slide2")}
                  </p>
                </div>
                <div className={clsx("keen-slider__slide", styles.fix)}>
                  <p className={styles.custom}>
                    <strong className={styles.strong}>650 000</strong>
                    {t("slide3")}
                  </p>
                </div>
                <div className={clsx("keen-slider__slide", styles.fix)}>
                  <p className={styles.custom}>
                    <strong className={styles.strong}>60</strong>
                    {t("slide4")}
                  </p>
                </div>
                <div className={clsx("keen-slider__slide", styles.fix)}>
                  <p className={styles.custom}>
                    <strong className={styles.strong}>200 000</strong>
                    {t("slide5")}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.childwrappers6}>
              <LinkButton href="FREE_WINE_ESTIMATION_URL" variant="primaryBlack">
                {t("button1")}
              </LinkButton>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.gridbox}>
        <div>
          <h2 className={styles.h22}>{t("h2-2")}</h2>
          <h3 className={styles.h3}>{t("h3")}</h3>
        </div>

        <div className={styles.colgrid2}>
          <Image src="/note-book.png" alt="vendre ses vins" width={100} height={100} />
          <h3>{t("h3-1")}</h3>
          <TransP i18nKey="h3-1-p" values={{ freeEstimateFormUrl }} />
        </div>

        <div className={styles.colgrid3}>
          <Image src="/car.png" alt="vendre ses vins" width={100} height={100} />
          <h3>{t("h3-2")}</h3>
          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("h3-2-p")) }} />
        </div>

        <div className={styles.colgrid4}>
          <Image src="/marteau.png" alt="vendre ses vins" width={100} height={100} />
          <h3>{t("h3-3")}</h3>
          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("h3-3-p")) }} />
        </div>

        <div className={styles.colgrid5}>
          <Image src="/money.png" alt="vendre ses vins" width={100} height={100} />
          <h3>{t("h3-4")}</h3>
          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("h3-4-p")) }} />
        </div>
      </div>

      <div className={styles.largewrapperbis}>
        <div className={styles.bg2}>
          <div className={styles.wrappergrid2}>
            <div className={styles.childwrappers3}>
              <div className={styles.colgrid1}>
                <h2 className={styles.h3}>{t("vendez-pour")}</h2>
              </div>

              <ul
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("vendez-pour-li")) }}
              ></ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recent}>
        <h2 className={styles.h2}>{t("h3-5")}</h2>

        <div className={styles.flex}>
          <figure>
            <Image
              src="/top-auction-1_450x300.jpg"
              alt="Vente de vin record, Pouilly Fumé Silex Dagueneau 1996"
              width={360}
              height={240}
            />
            <figcaption>
              <strong>
                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("1ervin")) }}></p>
              </strong>
              <strong
                className={"large"}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("1ervin-p")) }}
              ></strong>
              <small
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("1ervin-p2")) }}
              ></small>
            </figcaption>
          </figure>

          <figure>
            <Image
              src="/top-auction-2_450x300.jpg"
              alt="Vente de vin record, Meursault Les Narvaux Domaine d&rsquo;Auvenay 1999"
              width={360}
              height={240}
            />
            <figcaption>
              <strong
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("2emevin")) }}
              ></strong>
              <strong
                className={"large"}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("2emevin-p")) }}
              ></strong>
              <small
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("2emevin-p2")) }}
              ></small>
            </figcaption>
          </figure>

          <figure>
            <Image
              src="/top-auction-3_450x300.jpg"
              alt="Vente de vin record, Caisse Collection Lieux Dits Jacques Selosse"
              width={360}
              height={240}
            />
            <figcaption>
              <strong
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("3emevin")) }}
              ></strong>
              <strong
                className={"large"}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("3emevin-p")) }}
              ></strong>
              <small
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("3emevin-p2")) }}
              ></small>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className={styles.wrappergrid2}>
        <div className={styles.colgrid1}>
          <h2 className={styles.h2}>{t("h2-questions")}</h2>
        </div>
        <div className={styles.reponses}>
          {questionKeys.map(({ question, params }) => (
            <li key={question}>
              <span
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(`${question}.title`)) }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(t(`${question}.content`, params)),
                }}
              />
            </li>
          ))}
        </div>
      </div>

      <div className={styles.childwrappers6}>
        <LinkButton href="WINE_GUIDE_PDF" variant="primaryBlack">
          {t("button2")}
        </LinkButton>
        <LinkButton href="AUCTION_REPORT_MONTHLY" variant="primaryBlack">
          {t("button3")}
        </LinkButton>
        <TranslatableLink href={t("LinkBarometre")} dontTranslate>
          <Button variant="primaryBlack">{t("button4")}</Button>
        </TranslatableLink>
        <LinkButton href="FREE_WINE_ESTIMATION_URL" variant="primaryBlack">
          {t("button1")}
        </LinkButton>
      </div>
    </>
  );
};

export const getStaticProps = getCommonPageStaticProps;

// Exportation du composant Page
export default Page;
