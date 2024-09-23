import { sendGTMEvent } from "@next/third-parties/google";
import { asDate } from "@prismicio/helpers";
import { PrismicRichText, SliceZone } from "@prismicio/react";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";

import { CgsDocument } from "@/.slicemachine/prismicio";
import { components } from "@/slices";
import {
  DecoratedGetStaticProps,
  prismicClient,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { localeToPrismicLocale } from "@/utils/prismicUtils";

import styles from "./index.module.scss";

type CGSProps = {
  page?: CgsDocument;
};

const Page = ({ page }: CGSProps) => {
  const { t, lang } = useTranslation("conditions-generales");

  useMountEffect(() => {
    sendGTMEvent({
      page: "cgs",
      pageChapter1: "reglementation",
      pageChapter2: "",
    });
  });

  if (page === undefined) {
    return <p>CGS Not found</p>;
  }

  return (
    <div className={styles.viewport}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.content}>
        <div>
          <p>
            {t("lastModification")}{" "}
            <em className={styles.modifDate}>
              {asDate(page.data.last_modification)?.toLocaleDateString(lang) ?? ""}
            </em>
          </p>
          <h1 className={styles.title}>{page.data.title}</h1>
          <PrismicRichText
            field={page.data.introduction}
            components={{
              paragraph: ({ children }) => <p className={styles.paragraph}>{children}</p>,
            }}
          />
        </div>
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </div>
  );
};

const getStaticPageProps: DecoratedGetStaticProps<CGSProps> = async ({ locale }) => {
  try {
    const page = await prismicClient.getSingle("cgs", {
      lang: localeToPrismicLocale(locale),
    });

    return {
      props: {
        page,
      },
    };
  } catch {
    return {
      props: {},
    };
  }
};

export const getStaticProps = withCommonPagePropsDecorator(getStaticPageProps);

export default Page;
