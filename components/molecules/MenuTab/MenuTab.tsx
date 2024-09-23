import clsx from "clsx";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { translatedLinksKeys } from "@/urls/linksTranslation";
import { useTranslation } from "@/utils/next-utils";

import styles from "./MenuTab.module.scss";

type MenuTabProps = {
  tab: string;
  href: translatedLinksKeys;
  isActive?: boolean;
  activeTabIsTitle?: boolean;
};

const MenuTab = ({ href, tab, isActive, activeTabIsTitle }: MenuTabProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={styles.sellerMenuDiv}>
      <TranslatableLink
        className={clsx(styles.sellerMenuChild, isActive && styles.sellerMenuChildCurrent)}
        href={href}
      >
        {activeTabIsTitle && isActive ? (
          <h1 className={styles.titleTab}>{t(tab).toLocaleUpperCase()}</h1>
        ) : (
          t(tab).toLocaleUpperCase()
        )}
      </TranslatableLink>
    </div>
  );
};

export default MenuTab;
