import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import Image from "next/image";

import Button from "@/components/atoms/Button/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import CellarStaffCard from "@/components/organisms/CellarStaffCard/CellarStaffCard";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { PLPIndexName } from "@/hooks/useAlgoliaRefinements";
import { cinzelFont } from "@/styles/fonts";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t, lang } = useTranslation("cave-sur-mesure");
  type CellarPro = {
    imageSrc: string;
    alt: string;
    descriptionKey: string;
  };

  const phoneNumber: string = t("seventhPartPhoneNumber");

  const CellarPros: CellarPro[] = [
    {
      imageSrc: "/amicie.jpg",
      alt: "Amicie",
      descriptionKey: "amicieDescription",
    },
    {
      imageSrc: "/eloise.jpg",
      alt: "Eloise",
      descriptionKey: "eloiseDescription",
    },

    {
      imageSrc: "/raphael.jpg",
      alt: "Raphael",
      descriptionKey: "raphaelDescription",
    },
  ];

  useMountEffect(() => {
    sendGTMEvent({
      page: "cave_sur_mesure",
      pageChapter1: "services",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.page}>
        <div className={styles.firstPart}>
          <div className={styles.firstPartDescription}>
            <h1 className={clsx(styles.firstPartTitle, cinzelFont.className)}>
              <span>{t("customWineCellar")}</span>
              <br />
              <span>{t("freeServiceFor")}</span>
              <br />
              <span>{t("makeYourCellar")}</span>
              <br />
            </h1>
            <p className={styles.descriptionParagraph}>{t("firstPartParagraph")}</p>
            <Button variant="secondaryGolden" className={clsx(styles.button, cinzelFont.className)}>
              <a
                href={`https://idealwine.biz/Shopper/form.php?lang=${lang}`}
                target="_blank"
                rel="noreferrer"
              >
                {t("takeAnAppointment")}
              </a>
            </Button>
          </div>
          <div className={styles.bottlesImageDiv}>
            <Image
              src={"/bouteilles-2.jpg"}
              alt="Bouteilles de vin"
              width={600}
              height={394}
              className={styles.bottlesImage}
            />
          </div>
        </div>
        <div className={styles.secondPart}>
          <div className={clsx(cinzelFont.className, styles.secondPartTitle)}>
            <p>{t("your")}</p>
            <p>{t("objectives")}</p>
          </div>
          <div className={styles.delimiter} />
          <div className={styles.secondPartPdiv}>
            <div className={styles.secondPartP}>
              <p>{t("secondPartParagraph")}</p>
              <br />
              <br />
              <p>
                {t("secondPartP")} <strong>{t("secondPartStrong")}</strong>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.thirdPart}>
          <div className={styles.thirdPartList}>
            <Image
              src={"/shadow.png"}
              alt="shadow filter"
              width={550}
              height={550}
              className={styles.thirdPartShadowFilter}
            />
            <p className={clsx(cinzelFont.className, styles.thirdPartListTitle)}>
              {t("whatWeOffer")}
            </p>
            <ul className={styles.thirdPartListUl}>
              <li>{t("thirdPartList1")}</li>
              <br />
              <li>{t("thirdPartList2")}</li>
              <br />
              <li>{t("thirdPartList3")}</li>
              <br />
              <li>{t("thirdPartList4")}</li>
              <br />
              <li>{t("thirdPartList5")} </li>
              <br />
              <li>{t("thirdPartList6")}</li>
            </ul>
          </div>
          <Image
            src={"/background-cave.jpg"}
            alt="Cave à vin"
            width={1200}
            height={414}
            className={styles.cellarImage}
          />
        </div>
        <div className={styles.fourthPart}>
          <div className={styles.fourthPartPdiv}>
            <div className={styles.fourthPartP}>
              <p>{t("fourthPartParagraph")}</p>
            </div>
          </div>
          <div className={styles.delimiter} />
          <div className={clsx(cinzelFont.className, styles.fourthPartTitle)}>
            <p>{t("our")}</p>
            <p>{t("expertise")}</p>
          </div>
        </div>
        <div className={styles.fifthPart}>
          <div className={styles.fifthPartContainer}>
            <Image
              src={"/right.jpg"}
              alt="bouteille"
              width={231}
              height={350}
              className={styles.bgImage}
            />
            <Image
              src={"/left.jpg"}
              alt="bouteille"
              width={231}
              height={350}
              className={styles.bgImage}
            />

            <p className={clsx(styles.fifthPartTitle, cinzelFont.className)}>{t("trustOurTeam")}</p>
            <p className={styles.fifthPartParagraph}>{t("fifthPartParagraph")}</p>
            <Button
              variant="secondaryGolden"
              className={clsx(styles.button, cinzelFont.className, styles.fifthPartButton)}
            >
              <a
                className={styles.link}
                href="https://idealwine.biz/Shopper/form.php?lang=fr"
                target="_blank"
                rel="noreferrer"
              >
                {t("takeAnAppointment")}
              </a>
            </Button>
          </div>
        </div>
        <div>
          <p className={clsx(styles.sixthPartTitle, cinzelFont.className)}>{t("whoAreThey")}</p>
          <div className={styles.cellarProsBox}>
            {CellarPros.map((cellarPro: CellarPro, index: number) => (
              <CellarStaffCard
                key={index}
                imageSrc={cellarPro.imageSrc}
                alt={cellarPro.alt}
                descriptionKey={cellarPro.descriptionKey}
              />
            ))}
          </div>
          <div className={styles.sixthPartButtonContainer}>
            <Button
              variant="primaryGolden"
              className={clsx(styles.goldenButton, cinzelFont.className)}
            >
              <a
                className={styles.link}
                href="https://idealwine.biz/Shopper/form.php?lang=fr"
                target="_blank"
                rel="noreferrer"
              >
                {t("takeAnAppointment")}
              </a>
            </Button>
          </div>
        </div>
        <div className={styles.seventhPart}>
          <div className={styles.seventhPartText}>
            <div className={clsx(cinzelFont.className, styles.seventhPartTitle)}>
              <p> {t("anotherNeed")}</p>
              <p> {t("aFewIdeas")}</p>
              <p> {t("guidYou")}</p>
            </div>
            <div>
              <TranslatableLink
                className={styles.seventhPartLink}
                href={getPlpUrl(
                  { tags: ["LES-INDISPENSABLES"], sortBy: [`${PLPIndexName}_price_asc`] },
                  lang,
                )}
                dontTranslate
              >
                <p className={styles.seventhPartStrongText}>{t("discoverOurMustHave")}</p>
                <p className={styles.seventhPartParagraph}>{t("seventhPartParagraph1")}</p>
              </TranslatableLink>
              <TranslatableLink href="IM_A_NEWBIE_URL" className={styles.seventhPartLink}>
                <p className={styles.seventhPartStrongText}>{t("askMargaux")}</p>
                <p className={styles.seventhPartParagraph}>{t("seventhPartParagraph2")}</p>
              </TranslatableLink>
              <TranslatableLink href="CONTACT_URL" className={styles.seventhPartLink}>
                <p className={styles.seventhPartStrongText}>{t("anEvent")}</p>
                <p className={styles.seventhPartParagraph}>
                  {t("seventhPartParagraph3", { phoneNumber: phoneNumber })}

                  {t("seventhPartPhoneNumber")}
                </p>
              </TranslatableLink>
            </div>
          </div>
          <div className={styles.delimiter} />
          <div className={styles.seventhPartImagesBox}>
            <div className={styles.seventhPartImages}>
              <Image
                src={"/CellarSquare2.jpg"}
                alt="Cave à vin"
                width={230}
                height={230}
                className={styles.cellarImage}
              />
              <Image
                src={"/CellarSquare4.jpg"}
                alt="Cave à vin"
                width={230}
                height={230}
                className={styles.cellarImage}
              />
              <Image
                src={"/CellarSquare3.jpg"}
                alt="Cave à vin"
                width={230}
                height={230}
                className={styles.cellarImage}
              />
              <Image
                src={"/CellarSquare1.jpg"}
                alt="Cave à vin"
                width={230}
                height={230}
                className={styles.cellarImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
