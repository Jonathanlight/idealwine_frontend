import clsx from "clsx";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

import { HrefLangs } from "@/types/HrefLangs";
import { MY_IDEALWINE_PAGES_PREFIX, translatedLinks } from "@/urls/linksTranslation";
import { CommonPageProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import Footer from "../GeneralLayout/Footer";
import Header from "../GeneralLayout/Header";
import AuthWall from "./AuthWall";
import styles from "./Layout.module.scss";

type Props = {
  isOnPLP?: boolean;
  hrefLangs?: HrefLangs;
  isOnHome?: boolean;
  className?: string;
} & PropsWithChildren &
  CommonPageProps;

const Layout = ({
  isOnPLP,
  hrefLangs,
  isOnHome,
  children,
  className,
  ...commonPageProps
}: Props): JSX.Element => {
  const { pathname } = useRouter();
  const { lang } = useTranslation();

  const bankTransferFormUrl = translatedLinks["BANK_TRANSFER_FORM_URL"][lang];
  const layoutLessPages = new Set(["/404", "/500", bankTransferFormUrl]);

  const isMyIdealwine = pathname.startsWith(MY_IDEALWINE_PAGES_PREFIX);
  const hideHeaderAndFooter = layoutLessPages.has(pathname);

  return (
    <div className={clsx(styles.layoutContainer, className)}>
      {!hideHeaderAndFooter && (
        <Header isOnPLP={isOnPLP} hrefLangs={hrefLangs} {...commonPageProps} />
      )}
      <AuthWall>
        <main
          className={clsx(styles.mainContainer, isMyIdealwine && styles.myIdealwine)}
          id={true === isOnHome ? "forAbtasty" : ""}
        >
          <div className={styles.viewportContainer}>{children}</div>
        </main>
      </AuthWall>
      {!hideHeaderAndFooter && <Footer />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Layout;
