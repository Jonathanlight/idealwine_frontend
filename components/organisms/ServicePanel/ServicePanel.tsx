import { faBagShopping } from "@fortawesome/pro-thin-svg-icons/faBagShopping";
import { faBallPile } from "@fortawesome/pro-thin-svg-icons/faBallPile";
import { faChampagneGlasses } from "@fortawesome/pro-thin-svg-icons/faChampagneGlasses";
import { faCrown } from "@fortawesome/pro-thin-svg-icons/faCrown";
import { faGifts } from "@fortawesome/pro-thin-svg-icons/faGifts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import { ServicePlusLabel } from "@/utils/dynamicMenuConstants";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ServicePanel.module.scss";

const ServicePanel = ({ label }: { label: ServicePlusLabel }) => {
  const { t } = useTranslation("common");

  const serviceClassName = styles[label];

  const iconResolver = () => {
    switch (label) {
      case "loyaltyProgram":
        return faCrown;
      case "tailorMadeCellar":
        return faBagShopping;
      case "storageCellar":
        return faBallPile;
      case "corporateGifts":
        return faGifts;
      default:
        return faChampagneGlasses;
    }
  };

  return (
    <div className={clsx(styles.serviceContainer, serviceClassName)}>
      <div className={styles.service}>
        <FontAwesomeIcon icon={iconResolver()} size="3x" fontWeight={200} />
        <strong className={styles.serviceTitle}>{t(`header.dynamicMenu.${label}.title`)}</strong>
        <p className={styles.description}>{t(`header.dynamicMenu.${label}.description`)}</p>
        <p className={styles.thirdLine}>{t(`header.dynamicMenu.${label}.thirdLine`)}</p>
      </div>
    </div>
  );
};

export default ServicePanel;
