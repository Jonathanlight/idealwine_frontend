import clsx from "clsx";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import LoginForm from "@/components/organisms/LoginDialog/LoginForm/LoginForm";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const Login = () => {
  const { query, push } = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthenticatedUserContext();

  const redirectToNextPage = useCallback(() => {
    const toUrl = (query.dest as string | undefined) ?? "/";
    void push(toUrl);
  }, [push, query]);

  useEffect(() => {
    if (isNotNullNorUndefined(user)) redirectToNextPage();
  }, [user, redirectToNextPage]);

  return (
    <div className={styles.background}>
      <NextSeo title={t("login:seo.title")} description={t("login:seo.description")} />
      <hgroup className={styles.center}>
        <h1 className={styles.uppercase}>{t("common:login.memberAccess")}</h1>
        <p>{t("common:login.memberAccessMessage")}</p>
      </hgroup>
      <div className={styles.container}>
        <h2 className={clsx(styles.uppercase, styles.center)}>{t("common:login.pleaseLogin")}</h2>
        <LoginForm onSuccessSubmit={redirectToNextPage} />
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Login;
