import { generateUrl } from "@/urls/linksTranslation";
import {
  DecoratedGetServerSideProps,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";
import { isNonEmptyString } from "@/utils/ts-utils";

const Page = () => <></>;

// eslint-disable-next-line @typescript-eslint/require-await
const getServerSidePageProps: DecoratedGetServerSideProps = async ({ query }) => {
  const lang = "en";

  const { vente, numLot } = query;

  if (isNonEmptyString(vente) && isNonEmptyString(numLot)) {
    const newUrl = generateUrl("PDP_SAMPLE_URL", lang, { code: `${vente}-${numLot}` });

    return {
      redirect: {
        destination: `${newUrl}`,
        statusCode: 301,
      },
    };
  } else {
    return {
      props: {
        error: "Both vente and numLot parameters are required.",
      },
    };
  }
};

export const getServerSideProps = withCommonPagePropsDecorator(getServerSidePageProps);

export default Page;
