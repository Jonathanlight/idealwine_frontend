import { NextSeo } from "next-seo";

import BarometerOrLogin from "@/components/organisms/BarometerOrLogin";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

const Page = () => {
  const { t } = useTranslation("barometre");

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <BarometerOrLogin
        iframeTitle={t("iframeTitle")}
        iframeSrc={t("iframeSrc")}
        title={t("title")}
        connexionMessage={t("connexionMessage")}
      />
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
