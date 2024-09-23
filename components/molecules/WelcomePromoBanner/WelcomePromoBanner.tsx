import { WELCOME_COUPON_AMOUNT } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";

import Price from "../Price";
import styles from "./WelcomePromoBanner.module.scss";
const WelcomePromoBanner = () => {
  const { t } = useTranslation("accueil-profil");

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <Price price={WELCOME_COUPON_AMOUNT} size="big" className={styles.goldenColor} />
        <h1 className={styles.uppercase}>{t("welcomePromoBanner.title")}</h1>
        <h6 className={styles.uppercase}>{t("welcomePromoBanner.subtitle")}</h6>
      </div>
      <p className={styles.disclaimer}>{t("welcomePromoBanner.disclaimer")}</p>
    </div>
  );
};

export default WelcomePromoBanner;
