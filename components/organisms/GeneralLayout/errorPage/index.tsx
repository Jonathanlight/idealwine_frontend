import Image from "next/image";

import LinkButton from "@/components/atoms/Button/LinkButton";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

type Props = {
  statusCode: number;
  children: JSX.Element;
  secondTitle?: boolean;
};

const ErrorPage = ({ statusCode, children, secondTitle }: Props): JSX.Element => {
  const { t } = useTranslation("errors");
  const idealwineLogo = "/logo-idealwine-white.svg";

  return (
    <>
      <video className={styles.backgroundVideo} autoPlay muted loop>
        <source src="/video-background-errors.mp4" type="video/mp4" />
      </video>
      <div className={styles.contentViewport}>
        <div className={styles.contentContainer}>
          <TranslatableLink href="HOME_URL">
            <Image src={idealwineLogo} alt={""} width={170} height={50} />
          </TranslatableLink>
          <div>
            <p className={styles.errorCode}>{statusCode}</p>
            <h1 className={styles.errorTitle}>
              {t(`${statusCode}.title`)}

              {secondTitle && (
                <>
                  <br />
                  {t(`${statusCode}.secondTitle`)}
                </>
              )}
            </h1>
          </div>
          <div className={styles.errorText}>{children}</div>
          <div className={styles.buttonsContainer}>
            <LinkButton href="BUY_WINE_URL" variant="primaryGolden" className={styles.button}>
              {t("buy")}
            </LinkButton>
            <LinkButton href="SELL_MY_WINES_URL" variant="primaryGolden" className={styles.button}>
              {t("sell")}
            </LinkButton>
            <LinkButton href="VINTAGE_RATING_URL" variant="primaryGolden" className={styles.button}>
              {t("estimate")}
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
