import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAccessToken } from "@/hooks/useAccessToken";
import { useVerifyCustomerAccount } from "@/networking/mutator/axios-hooks";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation("common");
  const { query, replace } = useRouter();
  const { emailVerificationToken } = query as { emailVerificationToken?: string };
  const { setAccessToken } = useAccessToken();

  const { mutateAsync, error, isLoading } = useVerifyCustomerAccount<AxiosError>();

  useEffect(() => {
    if (emailVerificationToken === undefined) return;

    mutateAsync({ token: emailVerificationToken, data: {} })
      .then(data => {
        const accessToken = (data as unknown as { token: string }).token;
        setAccessToken(accessToken);

        return replace("/my_idealwine/confirmation-inscription");
      })
      .catch(() => {}); // an error occured, an error message is displayed
  }, [emailVerificationToken, mutateAsync, replace, setAccessToken]);

  return (
    <div className={styles.pageContainer}>
      {isLoading && <FontAwesomeIcon icon={faSpinnerThird} spin size="2xl" />}
      {error && <div>{t("login.emailVerificationError")}</div>}
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
