import { useTranslation } from "@/utils/next-utils";

import styles from "./FineSpiritsAuctionsBanner.module.scss";

const FineSpiritsAuctionsBanner = () => {
  const { t } = useTranslation("accueil-profil");

  return (
    <a href={t("loyaltyProgramMenu.fsaLink")} target="_blank" rel="noreferrer">
      <div className={styles.mainContainer}>
        {t("loyaltyProgramMenu.discoverFineSpiritsAuctions")}
      </div>
    </a>
  );
};

export default FineSpiritsAuctionsBanner;
