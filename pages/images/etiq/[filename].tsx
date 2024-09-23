import { defaultLocale } from "@/urls/linksTranslation";
import {
  DecoratedGetServerSideProps,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";

const Page = () => <></>;

const MIGRATED_PRODUCTS_PHOTOS_FOLDER = "00-images-etiq";

// eslint-disable-next-line @typescript-eslint/require-await
const getServerSidePageProps: DecoratedGetServerSideProps = async ({ params, locale }) => {
  if (locale !== defaultLocale) return { notFound: true };

  const filename = params?.filename?.toString() ?? "";

  const destination = `https://media.idealwine.com/${MIGRATED_PRODUCTS_PHOTOS_FOLDER}/${filename}`;

  return { redirect: { destination, statusCode: 301 } };
};

export const getServerSideProps = withCommonPagePropsDecorator(getServerSidePageProps);

export default Page;
