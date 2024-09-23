import clsx from "clsx";

import { cinzelFont } from "@/styles/fonts";
import { useTranslation } from "@/utils/next-utils";

import styles from "./SoonAvailableBanner.module.scss";

type Props = {
  className?: string;
};

const SoonAvailableBanner = ({ className }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  return <p className={clsx(styles.text, cinzelFont.className, className)}>{t("soonAvailable")}</p>;
};

export default SoonAvailableBanner;
