import { Content } from "@prismicio/client";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

export interface NormalizedBlogPost {
  id: string;
  link: string;
  title: string;
  date: string;
  excerpt: string;
  featured_media: number;
  imageSrc?: string;
  alt?: string;
}

export interface BlogPost {
  id: string;
  link: string;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  imageSrc: string;
  alt: string;
  featured_media: number;
}

export interface BlogImage {
  source_url: string;
  alt_text: string;
}

type JournalProps = Content.JournalSlice;

const Journal = ({
  slice: { primary },
  context: { blogPosts },
}: {
  slice: JournalProps;
  context: { blogPosts: NormalizedBlogPost[] };
}) => {
  const { t, lang } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString(lang, {
      day: "2-digit",
      month: "2-digit",
    });

    return `${formattedDate}`;
  };

  return (
    <section className={styles.flex}>
      <div className={styles.journalTitle}>{primary.title[0]?.text}</div>
      {blogPosts.length > 0 &&
        blogPosts.map(post => (
          <div className={styles.articleSection} key={post.id}>
            <TranslatableLink href={post.link} dontTranslate className={styles.article}>
              <Image
                className={styles.image}
                src={post.imageSrc ?? ""}
                alt={post.alt ?? ""}
                width={350}
                height={200}
              />
              <div className={styles.articleInformation}>
                <div
                  className={styles.title}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }}
                />
                <div>{formatDate(post.date)}</div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.excerpt) }} />
                <div>{primary.description[0]?.text}</div>
              </div>
            </TranslatableLink>
            <div className={styles.separator} />
          </div>
        ))}

      <TranslatableLink href={t("common:idealwineJournalUrl")} dontTranslate>
        <Button variant="primaryBlack"> {primary.morearticles[0]?.text}</Button>
      </TranslatableLink>
    </section>
  );
};

export default Journal;
