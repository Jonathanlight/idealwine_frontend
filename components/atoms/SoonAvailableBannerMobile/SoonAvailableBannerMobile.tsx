import { faBellPlus } from "@fortawesome/pro-light-svg-icons/faBellPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import { useTranslation } from "@/utils/next-utils";

import styles from "./SoonAvailableBannerMobile.module.scss";

type Props = {
  className?: string;
};

const SoonAvailableBannerMobile = ({ className }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  return (
    <span className={clsx(styles.mobileText, className)}>
      <span>{t("soonAvailable")}</span>
      <FontAwesomeIcon icon={faBellPlus} />
    </span>
  );
};

export default SoonAvailableBannerMobile;
