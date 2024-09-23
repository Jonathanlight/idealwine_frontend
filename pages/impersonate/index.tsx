import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAccessToken } from "@/hooks/useAccessToken";
import { getTranslatedHref } from "@/urls/linksTranslation";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { removeAccessToken } = useAccessToken();

  const { replace } = useRouter();

  const { lang } = useTranslation();

  const userProfileHomeUrl = getTranslatedHref("MY_IDEALWINE_HOME_URL", lang);

  useEffect(() => {
    const impersonate = async () => {
      removeAccessToken();
      await replace(userProfileHomeUrl);
    };

    void impersonate();
  }, [removeAccessToken, replace, userProfileHomeUrl]);

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faSpinnerThird} spin size="2xl" />
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
