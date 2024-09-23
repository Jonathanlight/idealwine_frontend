import clsx from "clsx";

import TooltipCustom from "@/components/molecules/Tooltip/Tooltip";
import { idealWineIconsFont } from "@/styles/fonts";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ProductVariantBiologicalProfilIcons.module.scss";

type Props = { isBio: boolean; isNatural: boolean; isTripleA: boolean; isBlockLayout?: boolean };

const ProductVariantBiologicalProfilIcons = ({
  isBio,
  isNatural,
  isTripleA,
  isBlockLayout = true,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        isBlockLayout ? styles.blockContainer : styles.inlineContainer,
        styles.specialIcons,
        idealWineIconsFont.className,
      )}
    >
      {isBio && (
        <div className={styles.bioIcon}>
          <TooltipCustom trigger={<span>A</span>} contentProps={{ side: "right" }}>
            <span>{t("product-card:bio")}</span>
          </TooltipCustom>
        </div>
      )}
      {isNatural && (
        <div className={styles.naturalIcon}>
          <TooltipCustom trigger={<span>K</span>} contentProps={{ side: "right" }}>
            <span>{t("product-card:natural")}</span>
          </TooltipCustom>
        </div>
      )}
      {isTripleA && (
        <div className={styles.tripleAIcon}>
          <TooltipCustom trigger={<span>S</span>} contentProps={{ side: "right" }}>
            <span>{t("product-card:tripleA")}</span>
          </TooltipCustom>
        </div>
      )}
    </div>
  );
};

export default ProductVariantBiologicalProfilIcons;
