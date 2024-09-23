import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import Image from "next/image";

import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const frReports = {
  "2021": {
    "01": "Auction Report - janvier 2021.pdf",
    "02": "Auction Report - fevrier 2021.pdf",
    "03": "Auction Report - mars 2021.pdf",
    "04": "Auction Report - avril 2021.pdf",
    "05": "Auction Report - mai 2021.pdf",
    "06": "Auction Report - juin 2021.pdf",
    "07": "Auction Report - juillet 2021.pdf",
    "08": "Auction Report - aout 2021.pdf",
    "09": "Auction Report - septembre 2021.pdf",
    "10": "Auction Report - octobre 2021.pdf",
    "11": "Auction Report - novembre 2021.pdf",
    "12": "Auction Report - decembre 2021.pdf",
  },
  "2022": {
    "01": "Auction Report - janvier 2022.pdf",
    "02": "Auction Report - fevrier 2022.pdf",
    "03": "Auction Report - mars 2022.pdf",
    "04": "Auction Report - avril 2022.pdf",
    "05": "Auction Report - mai 2022.pdf",
    "06": "Auction Report - juin 2022.pdf",
    "07": "Auction Report - juillet 2022.pdf",
    "08": "Auction Report - aout 2022.pdf",
    "09": "Auction Report - septembre 2022.pdf",
    "10": "Auction Report - octobre 2022.pdf",
    "11": "Auction Report - novembre 2022.pdf",
    "12": "Auction Report - decembre 2022.pdf",
  },
  "2023": {
    "01": "Auction Report - janvier 2023.pdf",
    "02": "Auction Report - fevrier 2023.pdf",
    "03": "Auction Report - mars 2023.pdf",
    "04": "Auction Report - avril 2023.pdf",
    "05": "Auction Report - mai 2023.pdf",
    "06": "Auction Report - juin 2023.pdf",
    "07": "Auction Report - juillet 2023.pdf",
    "08": "Auction Report - aout 2023.pdf",
    "09": "Auction Report - septembre 2023.pdf",
    "10": "Auction Report - octobre 2023.pdf",
    "11": "Auction Report - novembre 2023.pdf",
    "12": "Auction Report - decembre 2023.pdf",
  },
  "2024": {
    "01": "Auction Report - janvier 2024.pdf",
    "02": "Auction Report - fevrier 2024.pdf",
    "03": "Auction Report - mars 2024.pdf",
    "04": "Auction Report - avril 2024.pdf",
    "05": "Auction Report - mai 2024.pdf",
    "06": "Auction Report - juin 2024.pdf",
    "07": "Auction Report - juillet 2024.pdf",
    "08": "Auction Report - aout 2024.pdf",
  },
};

const enReports = {
  "2022": {
    "01": "Auction Report - January 2022.pdf",
    "02": "Auction Report - February 2022.pdf",
    "03": "Auction Report - March 2022.pdf",
    "04": "Auction Report - April 2022.pdf",
    "05": "Auction Report - May 2022.pdf",
    "06": "Auction Report - June 2022.pdf",
    "07": "Auction Report - July 2022.pdf",
    "08": "Auction Report - August 2022.pdf",
    "09": "Auction Report - September 2022.pdf",
    "10": "Auction Report - October 2022.pdf",
    "11": "Auction Report - November 2022.pdf",
    "12": "Auction Report - December 2022.pdf",
  },
  "2023": {
    "01": "Auction Report - January 2023.pdf",
    "02": "Auction Report - February 2023.pdf",
    "03": "Auction Report - March 2023.pdf",
    "04": "Auction Report - April 2023.pdf",
    "05": "Auction Report - May 2023.pdf",
    "06": "Auction Report - June 2023.pdf",
    "07": "Auction Report - July 2023.pdf",
    "08": "Auction Report - August 2023.pdf",
    "09": "Auction Report - September 2023.pdf",
    "10": "Auction Report - October 2023.pdf",
    "11": "Auction Report - November 2023.pdf",
    "12": "Auction Report - December 2023.pdf",
  },
  "2024": {
    "01": "Auction Report - January 2024.pdf",
    "02": "Auction Report - February 2024.pdf",
    "03": "Auction Report - March 2024.pdf",
    "04": "Auction Report - April 2024.pdf",
    "05": "Auction Report - May 2024.pdf",
    "06": "Auction Report - June 2024.pdf",
    "07": "Auction Report - July 2024.pdf",
    "08": "Auction Report - August 2024.pdf",
  },
};

const Page = () => {
  const { t, lang } = useTranslation("rapports-encheres");
  const items = lang === "fr" ? frReports : enReports;

  useMountEffect(() => {
    sendGTMEvent({
      page: "rapports_mensuels_marche_ventes_encheres_vin",
      pageChapter1: "edito",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />

      <div className={styles.wrapper}>
        <div className={styles.content1}>
          <figure>
            <Image
              className={styles.imgstyle}
              src="/bg-first.jpg"
              alt={t("alt5")}
              width={300}
              height={205}
            />
          </figure>

          <div>
            <h1 className={styles.h1}>{t("h1")}</h1>
            <h2 className={styles.h2}>{t("h2")}</h2>
          </div>
        </div>

        <div className={styles.content2}>
          {Object.entries(items)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, months]) => (
              <div className={styles.flex1} key={year}>
                <h3 className={styles.h3}>{t("yearTitle", { year })}</h3>
                <div className={styles.flex2}>
                  {Object.entries(months)
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([month, file]) => (
                      <a
                        className={styles.soussousitems}
                        key={month}
                        href={`/auctionReport/${file}`}
                      >
                        <h3>
                          <p className={styles.smallTitle}>
                            <small>{t("auctionReport")}</small>
                          </p>
                          <p>{t(`auctionReportLink.${month}`, { year })}</p>
                        </h3>
                      </a>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
