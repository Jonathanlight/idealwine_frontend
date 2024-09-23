import { defaultLocale } from "@/urls/linksTranslation";
import {
  DecoratedGetServerSideProps,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";

const Page = () => <></>;

const MIGRATED_VARIANT_PHOTOS_FOLDER = "00-migrated-variant-photos";
const MIGRATED_VARIANT_PHOTOS_WINEDEX_FOLDER = "00-migrated-variant-photos-winedex";

const formatMapping = {
  large: "",
  page: "%2Fcache%2Fproduct_variant_medium_small",
  mob: "%2Fcache%2Fproduct_variant_small",
  small: "%2Fcache%2Fproduct_variant_x_small",
  comp: "", // winedex images
} as const;

// eslint-disable-next-line @typescript-eslint/require-await
const getServerSidePageProps: DecoratedGetServerSideProps = async ({ params, locale }) => {
  const format = params?.format?.toString() ?? "";

  if (locale !== defaultLocale || !(format in formatMapping)) return { notFound: true };

  const filename = params?.filename?.toString() ?? "";

  let destination = "";

  if (format === "comp") {
    destination = `https://media.idealwine.com/${MIGRATED_VARIANT_PHOTOS_WINEDEX_FOLDER}/${filename}`;
  } else {
    const formatValue = formatMapping[format as keyof typeof formatMapping];

    destination = `https://media.idealwine.com${formatValue}/${MIGRATED_VARIANT_PHOTOS_FOLDER}/${filename}`;
  }

  return { redirect: { destination, statusCode: 301 } };
};

export const getServerSideProps = withCommonPagePropsDecorator(getServerSidePageProps);

export default Page;
