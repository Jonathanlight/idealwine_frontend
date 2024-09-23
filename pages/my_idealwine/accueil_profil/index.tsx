import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-toastify";

import AuctionsBarometerBanner from "@/components/atoms/BarometerBanner";
import ContactBanner from "@/components/atoms/ContactBanner";
import FillableBar from "@/components/atoms/FillableBar";
import FineSpiritsAuctionsBanner from "@/components/atoms/FineSpiritsAuctionsBanner";
import QuintessenceCellarBanner from "@/components/atoms/QuintessenceCellarBanner";
import { quintessenceSaleLink } from "@/components/atoms/QuintessenceCellarBanner/QuintessenceCellarBanner";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import LoyaltyCreditNotesSection from "@/components/molecules/LoyaltyCreditNotesSection";
import LoyaltyProgramMenu from "@/components/molecules/LoyaltyProgramMenu";
import Price from "@/components/molecules/Price";
import WelcomePromoBanner from "@/components/molecules/WelcomePromoBanner";
import ModifyPasswordForm from "@/components/organisms/MyIdealwineProfile/ModifyPasswordForm/ModifyPasswordForm";
import ModifyPaymentMethodForm from "@/components/organisms/MyIdealwineProfile/ModifyPaymentMethodForm";
import ModifyPersonalInformationForm from "@/components/organisms/MyIdealwineProfile/ModifyPersonalInformationForm";
import Referral from "@/components/organisms/Referral/Referral";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram } from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetCustomerItem } from "@/networking/sylius-api-client/customer/customer";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const getYears = (subscriptionDateString: string) => {
  const today = new Date();
  const subscriptionDate = new Date(subscriptionDateString);
  let age = today.getFullYear() - subscriptionDate.getFullYear();
  const month = today.getMonth() - subscriptionDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < subscriptionDate.getDate())) {
    age--;
  }

  return age;
};

const Page = (): JSX.Element => {
  const { t, lang } = useTranslation("accueil-profil");
  const { user } = useAuthenticatedUserContext();

  const myIdealwineLogo =
    user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.PRIVILEGE
      ? "/loyaltyProgramLogos/privilege.svg"
      : user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.IDEAL
      ? "/loyaltyProgramLogos/ideal.svg"
      : user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.QUINTESSENCE
      ? "/loyaltyProgramLogos/quintessence.svg"
      : "/loyaltyProgramLogos/none.svg";

  const welcomeText =
    user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.PRIVILEGE
      ? t("welcome_privilege")
      : user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.IDEAL
      ? t("welcome_ideal")
      : user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.QUINTESSENCE
      ? t("welcome_quintessence")
      : t("welcome");

  const { data: customer, isError } = useShopGetCustomerItem(user?.customerId ?? "", {
    query: { enabled: isNotNullNorUndefined(user) },
  });

  useEffect(() => {
    if (isError) void toast.error<string>(t("common:common.errorOccurred"));
  }, [isError, t]);

  const hasSetupAddress = user?.hasSetupAddress;

  const referralCode = customer?.user?.referralCode?.code;

  const hasSetupPayment = customer?.paymentMethod !== null;
  const completionPercentage = (((hasSetupAddress ? 1 : 0) + (hasSetupPayment ? 1 : 0)) * 100) / 2;

  const yearsSinceInscription =
    customer === undefined ? 0 : getYears(customer.createdAt ?? new Date().toDateString());
  const isOldEnoughToDisplaySubscriptionYears = yearsSinceInscription >= 5;

  const userLoyaltyProgram =
    user?.loyaltyProgram ?? CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.NONE;

  const isBasicLoyaltyProgram =
    userLoyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.NONE;

  const totalLoyaltyCreditNoteAmount = customer?.totalLoyaltyCreditNoteAmount ?? 0;
  const hasAvailableLoyaltyCreditNotes = totalLoyaltyCreditNoteAmount > 0;

  const totalGiftVoucherAmount = customer?.totalGiftVoucherAmount ?? 0;

  const hasAvailableGiftVouchers = totalGiftVoucherAmount > 0;

  const hasAlreadyOrdered = customer?.hasAlreadyOrdered;

  useMountEffect(() => {
    sendGTMEvent({
      page: "mon_profil",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.pageContainer}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.leftMenu}>
        <div className={styles.whitePart}>
          <Image src={myIdealwineLogo} alt="" width={96} height={144} />
          {isOldEnoughToDisplaySubscriptionYears && !isBasicLoyaltyProgram && (
            <div className={styles.subscriptionYearsBox}>
              <div>{yearsSinceInscription}</div>
              <div>{t("year", { count: yearsSinceInscription })}</div>
            </div>
          )}
          <div className={styles.whitePartTextContainer}>
            <h1 className={styles.whitePartWelcomeText}>{welcomeText}</h1>
            <div className={styles.whitePartText}>{customer?.fullName}</div>
          </div>
          <FillableBar filledPercentage={completionPercentage} />
        </div>
        <div className={styles.blackPart}>
          {user?.loyaltyProgram === "QUINTESSENCE" && (
            <TranslatableLink
              className={styles.blackPartGoldenText}
              href={getPlpUrl(quintessenceSaleLink.params, lang)}
              dontTranslate
            >
              {t("privateSalesQuintessence")}
            </TranslatableLink>
          )}
          <div>
            <a href="#personalInformation" className={styles.notUnderlined}>
              {t("personalInformation")}
              {!hasSetupAddress && <span className={styles.blackPartWarning}>!</span>}
            </a>
          </div>
          <div>
            <a href="#myPaymentMethod" className={styles.notUnderlined}>
              {t("myPaymentMethod")}
              {!hasSetupPayment && <span className={styles.blackPartWarning}>!</span>}
            </a>
          </div>
          <div>
            <a href="#changeMyPassword" className={styles.notUnderlined}>
              {t("changeMyPassword")}
            </a>
          </div>
          {referralCode !== undefined && (
            <div>
              <a href="#referral" className={styles.notUnderlined}>
                {t("referral")}
              </a>
            </div>
          )}
          <div>
            <a
              href="#myLoyaltyAccount"
              className={clsx(styles.blackPartGoldenText, styles.notUnderlined)}
            >
              {t("myLoyaltyAccount")}
            </a>
            <span className={styles.loyaltyCumulativeAmount}>
              <Price price={totalLoyaltyCreditNoteAmount} size="small" />
            </span>
          </div>
          {customer && !hasAlreadyOrdered && <WelcomePromoBanner />}
        </div>
      </div>
      <div className={styles.mainContent}>
        {(userLoyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.IDEAL ||
          userLoyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.PRIVILEGE) && (
          <>
            <FineSpiritsAuctionsBanner />
            <div className={styles.bannersContainer}>
              <AuctionsBarometerBanner variant="auctions" />
              <AuctionsBarometerBanner variant="fine-spirits" />
            </div>
          </>
        )}
        {userLoyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.QUINTESSENCE && (
          <>
            <div className={styles.bannersContainer}>
              {customer?.customerCommunicationManager && (
                <ContactBanner
                  customerCommunicationManager={customer.customerCommunicationManager}
                />
              )}
              <AuctionsBarometerBanner variant="auctions" />
            </div>
            <QuintessenceCellarBanner />
          </>
        )}
        <ModifyPersonalInformationForm customer={customer} />
        {customer !== undefined && user?.hasSetupAddress === true && (
          <ModifyPaymentMethodForm customer={customer} />
        )}
        <ModifyPasswordForm />
        {referralCode !== undefined && <Referral referralCode={referralCode} />}
        <LoyaltyProgramMenu loyaltyProgram={userLoyaltyProgram} />
        {(hasAvailableLoyaltyCreditNotes || hasAvailableGiftVouchers) && (
          <LoyaltyCreditNotesSection />
        )}
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
