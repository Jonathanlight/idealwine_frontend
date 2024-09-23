import {
  DecoratedGetServerSideProps,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";

const Page = () => <></>;

const MIGRATED_DOMAINS_PHOTOS_FOLDER = "00-images-domaine";

// eslint-disable-next-line @typescript-eslint/require-await
const getServerSidePageProps: DecoratedGetServerSideProps = async ({ params, locale }) => {
  if (locale !== "default") return { notFound: true };

  const filename = params?.filename?.toString() ?? "";

  const destination = `https://media.idealwine.com/${MIGRATED_DOMAINS_PHOTOS_FOLDER}/${filename}`;

  return { redirect: { destination, statusCode: 301 } };
};

export const getServerSideProps = withCommonPagePropsDecorator(getServerSidePageProps);

export default Page;
