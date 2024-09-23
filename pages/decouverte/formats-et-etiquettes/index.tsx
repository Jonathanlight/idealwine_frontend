import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import DOMPurify from "isomorphic-dompurify";
import { NextSeo } from "next-seo";
import Image from "next/image";

import { getTransP } from "@/components/atoms/TransP";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const TransP = getTransP("decouverte-formats-et-etiquettes");
  const { t } = useTranslation("decouverte-formats-et-etiquettes");

  useMountEffect(() => {
    sendGTMEvent({
      page: "formats_et_etiquettes",
      pageChapter1: "edito",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.wrapper}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div>
        <TransP i18nKey="ariane" />
      </div>
      <div className={styles.content1}>
        <figure className={styles.figurestyle}>
          <Image
            className={styles.imgstyle}
            src="/image-1.jpg"
            alt={t("alt1")}
            width={300}
            height={299}
          />
        </figure>
        <div>
          <h1 className={styles.h1}>{t("h1")}</h1>
          <TransP i18nKey="intro" />
        </div>
        <figure className={styles.figurestyle}>
          <Image
            className={styles.imgstyle}
            src="/image-2.jpg"
            alt={t("alt2")}
            width={300}
            height={300}
          />
        </figure>
      </div>

      <div className={styles.content2}>
        <div className={styles.souscontent}>
          <figure className={styles.figurestyle}>
            <Image
              className={styles.imgstyle}
              src="/image-3.jpg"
              alt={t("alt3")}
              width={500}
              height={336}
            />
          </figure>
          <div>
            <h2 className={styles.h2}>{t("part1_h2")}</h2>
            <p className={styles.imgstyle}>{t("part1_p1")}</p>
          </div>
        </div>
      </div>

      <div className={styles.content3}>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/img-format-1-grey.jpg"
                alt={t("alt4")}
                width={160}
                height={304}
              />
            </figure>
            <span>
              <h3 className={styles.h3}>{t("title_bordeaux")}</h3>{" "}
              <p
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("tab_tbody_bordeaux")) }}
              />
            </span>
          </li>
          <li className={styles.li}>
            {" "}
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/img-format-2.jpg"
                alt={t("alt5")}
                width={160}
                height={304}
              />
            </figure>
            <span>
              <h3 className={styles.h3}>{t("title_bourgogne")}</h3>

              <TransP i18nKey="tab_tbody_bourgogne" />
            </span>
          </li>
          <li className={styles.li}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/img-format-3-grey.jpg"
                alt={t("alt6")}
                width={160}
                height={304}
              />
            </figure>
            <span>
              <h3 className={styles.h3}>{t("title_rhone")}</h3>
              <TransP i18nKey="tab_tbody_rhone" />
            </span>
          </li>
          <li className={styles.li}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/img-format-4.jpg"
                alt={t("alt7")}
                width={160}
                height={304}
              />
            </figure>
            <span>
              <h3 className={styles.h3}>{t("title_champagne")}</h3>
              <TransP i18nKey="tab_tbody_champagne" />
            </span>
          </li>

          <li className={styles.li}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/img-format-5-grey.jpg"
                alt={t("alt8")}
                width={160}
                height={304}
              />
            </figure>
            <span>
              <h3 className={styles.h3}>{t("title_jura")}</h3>
              <TransP i18nKey="tab_tbody_jura" />
            </span>
          </li>
          <li className={styles.li}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/img-format-6.jpg"
                alt={t("alt9")}
                width={160}
                height={304}
              />
            </figure>
            <span>
              <h3 className={styles.h3}>{t("title_autres_formats")}</h3>
              <TransP i18nKey="tab_tbody_autres_formats" />
            </span>
          </li>
        </ul>
      </div>
      <div className={styles.content4}>
        <div className={styles.souscontent1}>
          <div>
            <h2 className={styles.h2}>{t("part2_h2")}</h2>
            <TransP i18nKey="part2_p1" />
          </div>
          <ul className={styles.ul}>
            <li className={styles.li}>{t("part4_li1")}</li>
            <li className={styles.li}>{t("part4_li2")}</li>
            <li className={styles.li}>{t("part4_li3")}</li>
            <li className={styles.li}>{t("part4_li4")}</li>
            <li className={styles.li}>{t("part4_li5")}</li>
            <li className={styles.li}>{t("part4_li6")}</li>
            <li className={styles.li}>{t("part4_li7")}</li>
          </ul>
        </div>
        <div className={styles.souscontent2}>
          <div>
            <h2 className={styles.h2}>{t("part4_h1")}</h2>
            <TransP i18nKey="part4_p1" />
            <h3 className={styles.h3}>{t("part4_h3")}</h3>
            <p className={styles.imgstyle}>{t("part4_h3_p1")}</p>
          </div>
          <div></div>
          <div>
            <h3 className={styles.h3}>{t("part4_h3_2")}</h3>
            <p className={styles.imgstyle}>{t("part4_h3_p2")}</p>
            <h3 className={styles.h3}>{t("part4_h3_3")}</h3>
            <p className={styles.imgstyle}>{t("part4_h3_p3")}</p>

            <h3 className={styles.h3}>{t("part4_h3_4")}</h3>
            <p className={styles.imgstyle}>{t("part4_h3_p4")}</p>
          </div>
        </div>
      </div>

      <div className={styles.contentbanner}>
        <h3 className={styles.h3}>{t("part4_h3_5")}</h3>
        <p className={styles.imgstyle}>
          <TransP i18nKey="part4_h3_p5" />
        </p>
      </div>

      <div className={styles.content5}>
        <div>
          <div className={styles.item}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/img-bouchon.jpg"
                alt={t("alt8")}
                width={200}
                height={204}
              />
            </figure>
            <div>
              <h2 className={styles.h2}>{t("part3_h2")}</h2>
              <TransP i18nKey="part3_p1" />
            </div>
          </div>
          <div className={styles.item}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/etiquette_alsace.gif"
                alt={t("alt1")}
                width={283}
                height={210}
              />
            </figure>
            <div>
              <h3 className={styles.h3}>{t("part5_alsace")}</h3>
              <p className={styles.imgstyle}>{t("part5_alsace_etiquette")}</p>
            </div>
          </div>

          <div className={styles.item}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/etiquette_champagne.gif"
                alt={t("alt1")}
                width={299}
                height={210}
              />
            </figure>
            <div>
              <h3 className={styles.h3}>{t("part5_champagne")}</h3>
              <TransP i18nKey="part5_champagne_etiquette" />
            </div>
          </div>

          <div className={styles.item}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/etiquette_bordeaux.gif"
                alt={t("alt1")}
                width={210}
                height={151}
              />
            </figure>
            <div>
              <h3 className={styles.h3}>{t("part5_bordeaux")}</h3>
              <TransP i18nKey="part5_bordeaux_etiquette" />
            </div>
          </div>

          <div className={styles.item}>
            <figure className={styles.figurestyle}>
              <Image
                className={styles.imgstyle}
                src="/etiquette_bourgogne.gif"
                alt={t("alt1")}
                width={210}
                height={152}
              />
            </figure>
            <div>
              <h3 className={styles.h3}>{t("part5_bourgogne")}</h3>
              <TransP i18nKey="part5_bourgogne_etiquette" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
