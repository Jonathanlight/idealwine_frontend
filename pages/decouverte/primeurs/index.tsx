import { NextSeo } from "next-seo";
import Image from "next/image";

import Button from "@/components/atoms/Button";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t, lang } = useTranslation("primeurs");

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />

      <div className={styles.wrapper}>
        <h1 className={styles.h1}>{t("primeurs-h2-1")}</h1>
        <div className={styles.content1}>
          <div className={styles.souscontent1}>
            <h2>{t("primeurs-h2-1")}</h2>
            <p>{t("primeurs-p-1")}</p>
            <a href={t("content1-link-1")}>
              <Button variant="primaryBlack"> {t("content1-a-1")}</Button>
            </a>
          </div>
          <figure className={styles.figurestyle}>
            <Image src="/prim0.jpg" alt={t("primeurs-h3-01")} width={300} height={299} />
          </figure>
        </div>
        {lang === "fr" ? (
          <>
            <section className={styles.content2}>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim01.jpg" alt={t("primeurs-h3-02")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-01")}</h3>
                <p>{t("primeurs-p-01")}</p>

                <a href={t("content2-link-01")}>
                  <Button variant="primaryBlack">{t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim02.jpg" alt={t("primeurs-h3-02")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-02")}</h3>
                <p>{t("primeurs-p-02")}</p>

                <a href={t("content2-link-02")}>
                  <Button variant="primaryBlack">{t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim03.jpg" alt={t("primeurs-h3-03")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-03")}</h3>
                <p>{t("primeurs-p-03")}</p>

                <a href={t("content2-link-03")}>
                  <Button variant="primaryBlack">{t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim04.jpg" alt={t("primeurs-h3-04")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-04")}</h3>
                <p>{t("primeurs-p-04")}</p>

                <a href={t("content2-link-04")}>
                  <Button variant="primaryBlack">{t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim1.jpg" alt={t("primeurs-h3-1")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-1")}</h3>
                <p>{t("primeurs-p-2")}</p>

                <a href={t("content2-link-1")}>
                  <Button variant="primaryBlack">{t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim2.jpg" alt={t("primeurs-h3-3")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-3")}</h3>
                <p>{t("primeurs-p-3")}</p>

                <a href={t("content2-link-2")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim3.jpg" alt={t("primeurs-h3-4")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-4")}</h3>
                <p>{t("primeurs-p-4")}</p>
                <a href={t("content2-link-3")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim4.jpg" alt={t("primeurs-h3-5")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-5")}</h3>
                <p>{t("primeurs-p-5")}</p>
                <a href={t("content2-link-4")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim5.jpg" alt={t("primeurs-h3-6")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-6")}</h3>
                <p>{t("primeurs-p-6")}</p>
                <a href={t("content2-link-5")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim6.png" alt={t("primeurs-h3-7")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-7")}</h3>
                <p>{t("primeurs-p-7")}</p>
                <a href={t("content2-link-6")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim7.gif" alt={t("primeurs-h3-8")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-8")}</h3>
                <p>{t("primeurs-p-8")}</p>
                <a href={t("content2-link-7")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim8.gif" alt={t("primeurs-h3-9")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-9")}</h3>
                <p>{t("primeurs-p-9")}</p>
                <a href={t("content2-link-8")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim9.jpg" alt={t("primeurs-h3-10")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-10")}</h3>
                <p>{t("primeurs-p-10")}</p>
                <a href={t("content2-link-9")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim10.jpg" alt={t("primeurs-h3-11")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-11")}</h3>
                <p>{t("primeurs-p-11")}</p>
                <a href={t("content2-link-10")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/9HXNgByhm0Y"
                    title="Idée de placements : La campagne des primeurs de Bordeaux, toujours un temps fort pour les amateurs"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-12")}</h3>
                <p>{t("primeurs-p-12")}</p>
                <a href={t("content2-link-11")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim13.jpg" alt={t("primeurs-h3-12")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-13")}</h3>
                <p>{t("primeurs-p-13")}</p>
                <a href={t("content2-link-12")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim14.gif" alt={t("primeurs-h3-13")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-14")}</h3>
                <p>{t("primeurs-p-14")}</p>
                <a href={t("content2-link-13")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim15.gif" alt={t("primeurs-h3-14")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-15")}</h3>
                <p>{t("primeurs-p-15")}</p>
                <a href={t("content2-link-14")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim16.jpg" alt={t("primeurs-h3-15")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-16")}</h3>
                <p>{t("primeurs-p-16")}</p>
                <a href={t("content2-link-15")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim16.jpg" alt={t("primeurs-h3-16")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-17")}</h3>
                <p>{t("primeurs-p-17")}</p>
                <a href={t("content2-link-16")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim18.jpg" alt={t("primeurs-h3-17")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-18")}</h3>
                <p>{t("primeurs-p-18")}</p>
                <a href={t("content2-link-17")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/9HXNgByhm0Y"
                    title="Idée de placements : La campagne des primeurs de Bordeaux, toujours un temps fort pour les amateurs"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-19")}</h3>
                <p>{t("primeurs-p-19")}</p>
                <a href={t("content2-link-18")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/yqQmLD1HsL8"
                    title="Placement vin : Episode de gel dans le vignoble, quel impact ? Premiers retour sur les primeurs 2020"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-20")}</h3>
                <p>{t("primeurs-p-20")}</p>
                <a href={t("content2-link-19")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim21.jpg" alt={t("primeurs-h3-20")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-21")}</h3>
                <p>{t("primeurs-p-21")}</p>
                <a href={t("content2-link-20")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim22.jpg" alt={t("primeurs-h3-21")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-22")}</h3>
                <p>{t("primeurs-p-22")}</p>
                <a href={t("content2-link-21")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim23.jpg" alt={t("primeurs-h3-22")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-23")}</h3>
                <p>{t("primeurs-p-23")}</p>
                <a href={t("content2-link-22")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim24.jpg" alt={t("primeurs-h3-23")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-24")}</h3>
                <p>{t("primeurs-p-24")}</p>
                <a href={t("content2-link-23")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/mkVCA82iH3w"
                    title="Analyse du millésime 2019 à Bordeaux avant la vente en primeurs - 04/06/2020"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-25")}</h3>
                <p>{t("primeurs-p-25")}</p>
                <a href={t("content2-link-24")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/HX5cT9NnlqE"
                    title="Placement vin : vers un exceptionnel millésime 2018 - Angélique de Lencquesaing - 27/09/18"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-26")}</h3>
                <p>{t("primeurs-p-26")}</p>
                <a href={t("content2-link-25")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim28.jpg" alt={t("primeurs-h3-27")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-27")}</h3>
                <p>{t("primeurs-p-27")}</p>
                <a href={t("content2-link-26")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim28.jpg" alt={t("primeurs-h3-28")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-28")}</h3>
                <p>{t("primeurs-p-28")}</p>
                <a href={t("content2-link-27")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>

              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim29.jpg" alt={t("primeurs-h3-29")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-29")}</h3>
                <p>{t("primeurs-p-29")}</p>
                <a href={t("content2-link-28")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim30.jpg" alt={t("primeurs-h3-30")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-30")}</h3>
                <p>{t("primeurs-p-30")}</p>
                <a href={t("content2-link-29")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim31.jpg" alt={t("primeurs-h3-31")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-31")}</h3>
                <p>{t("primeurs-p-31")}</p>
                <a href={t("content2-link-30")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim32.jpg" alt={t("primeurs-h3-32")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-32")}</h3>
                <p>{t("primeurs-p-32")}</p>
                <a href={t("content2-link-31")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim33.jpg" alt={t("primeurs-h3-33")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-33")}</h3>
                <p>{t("primeurs-p-33")}</p>
                <a href={t("content2-link-32")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/9B2PYUrMUso"
                    title="Placement vin : analyse du millésime 2017 - Angélique de Lencquesaing sur BFM Business 26/04/2018"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-34")}</h3>
                <p>{t("primeurs-p-34")}</p>
                <a href={t("content2-link-33")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim35.jpg" alt={t("primeurs-h3-35")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-35")}</h3>
                <p>{t("primeurs-p-35")}</p>
                <a href={t("content2-link-34")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim36.jpg" alt={t("primeurs-h3-36")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-36")}</h3>
                <p>{t("primeurs-p-36")}</p>
                <a href={t("content2-link-35")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim29.jpg" alt={t("primeurs-h3-37")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-37")}</h3>
                <p>{t("primeurs-p-37")}</p>
                <a href={t("content2-link-36")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim38.jpg" alt={t("primeurs-h3-38")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-38")}</h3>
                <p>{t("primeurs-p-38")}</p>
                <a href={t("content2-link-37")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/4_hWWNl5i5E"
                    title="Placement vin : primeurs 2016, impact du Brexit sur le marché du vin... par A. de Lencquesaing"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-39")}</h3>
                <p>{t("primeurs-p-39")}</p>
                <a href={t("content2-link-38")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim40.jpg" alt={t("primeurs-h3-40")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-40")}</h3>
                <p>{t("primeurs-p-40")}</p>
                <a href={t("content2-link-39")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/yNY-5b8ynqs"
                    title="Primeurs à Bordeaux : faut-il investir dans le millésime 2015 ? (BFM Business 14/4/16)"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-41")}</h3>
                <p>{t("primeurs-p-41")}</p>
                <a href={t("content2-link-40")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim42.jpg" alt={t("primeurs-h3-42")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-42")}</h3>
                <p>{t("primeurs-p-42")}</p>
                <a href={t("content2-link-41")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim43.jpg" alt={t("primeurs-h3-43")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-43")}</h3>
                <p>{t("primeurs-p-43")}</p>
                <a href={t("content2-link-42")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <iframe
                    width="361"
                    height="230"
                    src="https://www.youtube.com/embed/81VTBpAxZ5M"
                    title="A. de Lencquesaing : l&#39;impact de la campagne primeur sur le marché du vin (BFM Business 24/03)"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </figure>
                <h3>{t("primeurs-h3-44")}</h3>
                <p>{t("primeurs-p-44")}</p>
                <a href={t("content2-link-43")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <figure className={styles.figurestyle}>
                  <Image src="/prim45.jpg" alt={t("primeurs-h3-42")} width={361} height={241} />
                </figure>
                <h3>{t("primeurs-h3-45")}</h3>
                <p>{t("primeurs-p-45")}</p>
                <a href={t("content2-link-44")}>
                  <Button variant="primaryBlack"> {t("primeurs-btn-1")}</Button>
                </a>
              </article>
              <article className={styles.article}>
                <p>......</p>
              </article>
            </section>
            <div className={styles.content3}>
              <h3> {t("content3-h3-1")}</h3>
              <a target="_blank" href={t("content3-link-1")} rel="noreferrer">
                {t("content3-a-1")}
              </a>
              <a target="_blank" href={t("content3-link-2")} rel="noreferrer">
                {t("content3-a-2")}
              </a>
              <a target="_blank" href={t("content3-link-3")} rel="noreferrer">
                {t("content3-a-3")}
              </a>
              <a target="_blank" href={t("content3-link-4")} rel="noreferrer">
                {t("content3-a-4")}
              </a>
              <a target="_blank" href={t("content3-link-4")} rel="noreferrer">
                {t("content3-a-4")}
              </a>
              <a target="_blank" href={t("content3-link-5")} rel="noreferrer">
                {t("content3-a-5")}
              </a>
              <a target="_blank" href={t("content3-link-6")} rel="noreferrer">
                {t("content3-a-6")}
              </a>
              <a target="_blank" href={t("content3-link-7")} rel="noreferrer">
                {t("content3-a-7")}
              </a>

              <h3> {t("content3-h3-2")}</h3>
              <a target="_blank" href={t("content3-link-8")} rel="noreferrer">
                {t("content3-a-8")}
              </a>
              <a target="_blank" href={t("content3-link-9")} rel="noreferrer">
                {t("content3-a-9")}
              </a>
              <a target="_blank" href={t("content3-link-10")} rel="noreferrer">
                {t("content3-a-10")}
              </a>
              <a target="_blank" href={t("content3-link-11")} rel="noreferrer">
                {t("content3-a-11")}
              </a>
              <h3> {t("content3-h3-3")}</h3>
              <a target="_blank" href={t("content3-link-12")} rel="noreferrer">
                {t("content3-a-12")}
              </a>
              <a target="_blank" href={t("content3-link-13")} rel="noreferrer">
                {t("content3-a-13")}
              </a>
              <a target="_blank" href={t("content3-link-14")} rel="noreferrer">
                {t("content3-a-14")}
              </a>
              <h3> {t("content3-h3-4")}</h3>
              <a target="_blank" href={t("content3-link-15")} rel="noreferrer">
                {t("content3-a-15")}
              </a>
              <h3> {t("content3-h3-5")}</h3>
              <a target="_blank" href={t("content3-link-16")} rel="noreferrer">
                {t("content3-a-16")}
              </a>
              <a target="_blank" href={t("content3-link-17")} rel="noreferrer">
                {t("content3-a-17")}
              </a>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
