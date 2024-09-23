import clsx from "clsx";
import Trans from "next-translate/Trans";
import Image from "next/image";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

type Props = {
  loyaltyProgram: CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram;
};

type LoyaltyProgramBannerProps = {
  loyaltyProgram: Exclude<CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram, "NONE">;
};

const loyaltyProgramDiscount = {
  [CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.PRIVILEGE]: 3,
  [CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.IDEAL]: 5,
  [CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.QUINTESSENCE]: 5,
};

const NoLoyaltyProgramBanner = () => {
  const { t } = useTranslation("accueil-profil");

  return (
    <div className={clsx(styles.textContainer)}>
      <TranslatableLink href="LOYALTY_PROGRAM_URL" className={clsx(styles.title, styles.link)}>
        {t("loyaltyProgramMenu.title")}
      </TranslatableLink>
      <p>{t("loyaltyProgramMenu.noLoyaltyProgram1")}</p>
      <p>{t("loyaltyProgramMenu.noLoyaltyProgram2")}</p>
      <TranslatableLink href="LOYALTY_PROGRAM_URL">
        <Button variant="primaryBlack">
          <span className={styles.button}>{t("loyaltyProgramMenu.discoverLoyaltyProgram")}</span>
        </Button>
      </TranslatableLink>
      <p className={styles.disclaimer}>{t("loyaltyProgramMenu.noLoyaltyProgramDisclaimer")}</p>
    </div>
  );
};

const LoyaltyProgramBanner = ({ loyaltyProgram }: LoyaltyProgramBannerProps) => {
  const { t } = useTranslation("accueil-profil");

  const loyaltyProgramNormalized = (loyaltyProgram.charAt(0).toUpperCase() +
    loyaltyProgram.slice(1).toLowerCase()) as "Ideal" | "Privilege" | "Quintessence";

  return (
    <div className={styles.textContainer}>
      <TranslatableLink href="LOYALTY_PROGRAM_URL" className={clsx(styles.title, styles.link)}>
        {t("loyaltyProgramMenu.title")}
      </TranslatableLink>
      <p className={styles.subtitle}>
        {t("loyaltyProgramMenu.advantages", {
          userLoyaltyProgram:
            loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.IDEAL
              ? "Club Ideal"
              : loyaltyProgramNormalized,
        })}
      </p>

      <ul className={styles.list}>
        <li>
          <Trans
            ns="accueil-profil"
            i18nKey={"loyaltyProgramMenu.avantage1"}
            components={[
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <strong key={0} />,
            ]}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            values={{ reductionPercentage: loyaltyProgramDiscount[loyaltyProgram] }}
          />
        </li>
        <li>{t("loyaltyProgramMenu.avantage2")}</li>
        <li>
          {t("loyaltyProgramMenu.partnerAdvantages")}
          <ul className={styles.list}>
            <li>
              <Trans
                ns="accueil-profil"
                i18nKey={"loyaltyProgramMenu.partnerAdvantages1"}
                components={[
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    key={0}
                    href="https://www.coravin.fr/shop/category/all"
                    className={styles.link}
                    target="_blank"
                    rel="noreferrer"
                  />,
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    key={1}
                    href="https://www.eurocave.fr/fr/shop/"
                    className={styles.link}
                    target="_blank"
                    rel="noreferrer"
                  />,
                ]}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                values={{
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  partnerStore0: t("loyaltyProgramMenu.partnerStore0"),
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  partnerStore: t("loyaltyProgramMenu.partnerStore"),
                }}
              />
            </li>
            <li>{t("loyaltyProgramMenu.partnerAdvantages2")}</li>
          </ul>
        </li>
      </ul>

      <p className={styles.disclaimer}>
        <Trans
          ns="accueil-profil"
          i18nKey={"loyaltyProgramMenu.disclaimer"}
          components={[
            <TranslatableLink key={0} href="LOYALTY_PROGRAM_URL" className={styles.link} />,
          ]}
        />
      </p>
    </div>
  );
};

const LoyaltyProgramMenu = ({ loyaltyProgram }: Props) => {
  const { lang } = useTranslation("accueil-profil");
  const isBasicLoyaltyProgram =
    loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.NONE;

  return (
    <div id="myLoyaltyAccount" className={clsx(styles.bigCard, styles.mainContainer)}>
      <Image
        width={300}
        height={300}
        src={`/loyaltyProgramDiscounts/${loyaltyProgram}_DISCOUNT_${lang}.jpg`}
        alt="Loyalty program discount image"
        className={styles.image}
      />
      {isBasicLoyaltyProgram ? (
        <NoLoyaltyProgramBanner />
      ) : (
        <LoyaltyProgramBanner loyaltyProgram={loyaltyProgram} />
      )}
    </div>
  );
};
export default LoyaltyProgramMenu;
