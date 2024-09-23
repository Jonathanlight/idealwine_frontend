import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import DOMPurify from "isomorphic-dompurify";
import { NextSeo } from "next-seo";

import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("faq");
  const items = t<{ header: string; content?: string | { header: string; content?: string }[] }[]>(
    "items",
    {},
    { returnObjects: true, default: [] },
  );

  useMountEffect(() => {
    sendGTMEvent({
      page: "faq",
      pageChapter1: "aide",
      pageChapter2: "",
    });
  });

  return (
    <>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />

      <div className={styles.accordion}>
        <h1 className={styles.h1}>{t("h1")}</h1>

        <Accordion className={styles.bloc}>
          {items.map(({ header, content }, i) => (
            <AccordionItem
              className={styles.items}
              key={i}
              header={
                <h2
                  className={styles.h2}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(header) }}
                ></h2>
              }
            >
              {Array.isArray(content) ? (
                <Accordion className={styles.sousitems}>
                  {content.map((subItem, subIndex) => (
                    <AccordionItem
                      className={styles.soussousitems}
                      header={
                        <h3
                          className={styles.h3}
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subItem.header) }}
                        ></h3>
                      }
                      key={subIndex}
                    >
                      <span
                        className={styles.span}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(subItem.content as string),
                        }}
                      ></span>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <span
                  className={styles.span}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(content as string),
                  }}
                ></span>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
