import clsx from "clsx";
import Image from "next/image";

import { CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram } from "@/networking/sylius-api-client/.ts.schemas";
import { cinzelFont } from "@/styles/fonts";
import { useTranslation } from "@/utils/next-utils";

import styles from "./LoyaltyProgramReduction.module.scss";
type Props = {
  loyaltyProgram: CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram;
  className?: string;
};

const LOYALTY_PROGRAM_DISCOUNT = {
  NONE: 0,
  PRIVILEGE: 3,
  IDEAL: 5,
  QUINTESSENCE: 5,
};

const LOYALTY_PROGRAM_LOGO_PATH = {
  NONE: "/loyaltyProgramCrowns/standard.svg",
  PRIVILEGE: "/loyaltyProgramCrowns/privilege.svg",
  IDEAL: "/loyaltyProgramCrowns/ideal.svg",
  QUINTESSENCE: "/loyaltyProgramCrowns/quintessence.svg",
};

const LoyaltyProgramReduction = ({ loyaltyProgram, className }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");
  const isClassic = loyaltyProgram === "NONE";

  return (
    <div className={clsx(styles.loyalityPromoContainer, cinzelFont.className, className)}>
      <Image
        src={LOYALTY_PROGRAM_LOGO_PATH[loyaltyProgram]}
        alt={loyaltyProgram}
        width={55}
        height={36}
      />
      <span className={styles.title}>{t(`loyaltyProgram.${loyaltyProgram}`)}</span>
      <span className={styles.discount}>
        {isClassic
          ? t("loyaltyProgram.onlyLoyaltyProgramUsersTitle")
          : `${LOYALTY_PROGRAM_DISCOUNT[loyaltyProgram]}% ${t("loyaltyProgram.offer")}`}
      </span>
      <span className={styles.cumulativeDiscount}>
        {isClassic
          ? t("loyaltyProgram.onlyLoyaltyProgramUsersDescription")
          : t("loyaltyProgram.cumulativeDiscount", {
              discount: LOYALTY_PROGRAM_DISCOUNT[loyaltyProgram],
            })}
      </span>
    </div>
  );
};

export default LoyaltyProgramReduction;
