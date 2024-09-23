import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { useTranslation } from "@/utils/next-utils";

import styles from "./StorageComponent.module.scss";

type Props = { allowed: boolean };

const StorageComponent = ({ allowed }: Props) => {
  const { t } = useTranslation("livraison");

  return (
    <div className={styles.textContainer}>
      {allowed ? (
        <div>{t("STORAGE.allowed")}</div>
      ) : (
        <>
          <div>{t("STORAGE.notAllowed")}</div>
          <div>
            {t("STORAGE.learnMore")}{" "}
            <TranslatableLink href="WINE_STORAGE_URL">{t("STORAGE.clickHere")}</TranslatableLink>
          </div>
        </>
      )}
    </div>
  );
};

export default StorageComponent;
