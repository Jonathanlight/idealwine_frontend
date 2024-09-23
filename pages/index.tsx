import { sendGTMEvent } from "@next/third-parties/google";
import { SliceZone } from "@prismicio/react";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";

import { HomepageDocument } from "@/.slicemachine/prismicio";
import { components } from "@/slices";
import { BlogImage, BlogPost, NormalizedBlogPost } from "@/slices/Journal";
import { getLastOrdersQueryParams } from "@/slices/LastOrders";
import { firstVisibleReleaseRegion, getNewReleasesQueryParams } from "@/slices/NewReleases";
import { CACHE_DURATIONS_IN_SECONDS } from "@/utils/constants";
import {
  DecoratedGetStaticProps,
  prismicClient,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { localeToPrismicLocale } from "@/utils/prismicUtils";

import styles from "./index.module.scss";

type HomeProps = {
  page: HomepageDocument;
  blogPosts: NormalizedBlogPost[];
};

const fetchBlogPostsAndImages = async (lang: string) => {
  const postsResponse: Response = await fetch(
    `https://www.idealwine.${lang === "fr" ? "net" : "info"}/wp-json/wp/v2/posts?per_page=4`,
  );
  const postsData = (await postsResponse.json()) as BlogPost[];

  const enrichedPosts = await Promise.all(
    postsData.map(async post => {
      try {
        const imageResponse = await fetch(
          `https://www.idealwine.${lang === "fr" ? "net" : "info"}/wp-json/wp/v2/media/${
            post.featured_media
          }`,
        );
        const imageData = (await imageResponse.json()) as BlogImage;
        let imageDataObject = {};

        if (imageResponse.status === 200) {
          imageDataObject = {
            imageSrc: imageData.source_url,
            alt: imageData.alt_text,
          };
        }

        return {
          id: post.id,
          link: post.link,
          title: post.title.rendered,
          date: post.date,
          excerpt: post.excerpt.rendered,
          featured_media: post.featured_media,
          ...imageDataObject,
        };
      } catch (error) {
        return {
          id: post.id,
          link: post.link,
          title: post.title.rendered,
          date: post.date,
          excerpt: post.excerpt.rendered,
          featured_media: post.featured_media,
        };
      }
    }),
  );

  return enrichedPosts;
};

const Home = ({ page, blogPosts }: HomeProps): JSX.Element => {
  const { t } = useTranslation("home");

  useMountEffect(() => {
    sendGTMEvent({
      page: "accueil",
      pageChapter1: "",
      pageChapter2: "",
    });
  });

  return (
    <>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.pageContainer}>
        <SliceZone slices={page.data.slices} components={components} />
        <div className={styles.doubleSlices}>
          <div className={styles.leftSlice}>
            {/* left slice is for prismic ratingSearch, SellMyWines paragraph and idealwineIndexes */}
            <SliceZone slices={page.data.slices1} components={components} />
          </div>
          {/* right slice is for prismic articles */}
          <SliceZone slices={page.data.slices2} components={components} context={{ blogPosts }} />
        </div>
      </div>
    </>
  );
};

const getStaticPageProps: DecoratedGetStaticProps<HomeProps> = async ({ locale, queryClient }) => {
  const [page, blogPosts] = await Promise.all([
    prismicClient.getSingle("homepage", {
      lang: localeToPrismicLocale(locale),
    }),
    fetchBlogPostsAndImages(locale ?? "fr"),
    queryClient.fetchQuery(getLastOrdersQueryParams(locale)),
    queryClient.fetchQuery(getNewReleasesQueryParams(locale, firstVisibleReleaseRegion)),
  ]);

  return {
    props: { page, blogPosts, isOnHome: true },
    revalidate: CACHE_DURATIONS_IN_SECONDS.TWO_MINUTES,
  };
};

export const getStaticProps = withCommonPagePropsDecorator(getStaticPageProps);

export default Home;
