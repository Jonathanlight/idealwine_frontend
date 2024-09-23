import { faUser } from "@fortawesome/pro-light-svg-icons/faUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import Popover from "@/components/molecules/Popover";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useAccessToken } from "@/hooks/useAccessToken";
import { isPagePrivate, LOGOUT_URL } from "@/networking/mutator/axios-hooks";
import { refreshTokenAxiosInstance } from "@/networking/mutator/custom-client-instance";
import { CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyString } from "@/utils/ts-utils";

import styles from "./MyIDealwineButton.module.scss";

const MyIDealwineButton = () => {
  const { t } = useTranslation("common");
  const [isMyAccountMenuOpen, setIsMyAccountMenuOpen] = useState(false);
  const { push, asPath } = useRouter();

  const { user, setIsLoginModalOpen } = useAuthenticatedUserContext();
  const { removeAccessToken } = useAccessToken();

  const close = () => setIsMyAccountMenuOpen(false);

  const onClick = () => {
    if (user) {
      setIsMyAccountMenuOpen(isOpen => !isOpen);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const logout = async () => {
    close();

    try {
      await refreshTokenAxiosInstance.get(LOGOUT_URL, { withCredentials: true });
      if (!isPagePrivate(asPath)) {
        toast.success<string>(t("login.logoutSuccess"));
      }
    } catch (error) {
      toast.error<string>(t("common.errorOccurred"));
    }

    removeAccessToken();

    if (isPagePrivate(asPath)) {
      void push(`/login?dest=${asPath}`);
    }
  };

  const isImpersonatingUser = user?.adminEmailImpersonatingUser !== undefined;
  const myIdealwineLogo =
    user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.PRIVILEGE
      ? "/loyaltyProgramCrowns/privilege.svg"
      : user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.IDEAL
      ? "/loyaltyProgramCrowns/ideal.svg"
      : user?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.QUINTESSENCE
      ? "/loyaltyProgramCrowns/quintessence.svg"
      : "";

  return (
    <Popover
      open={isMyAccountMenuOpen}
      onOpenChange={onClick}
      className={styles.dropdownMenuContent}
      trigger={
        <div className={clsx(styles.shopIcon, isImpersonatingUser && styles.impersonatingUser)}>
          <FontAwesomeIcon id="formconnexion" icon={faUser} />
        </div>
      }
    >
      {isImpersonatingUser && (
        <div className={styles.impersonatedBy}>
          {t("login.impersonatedBy", { email: user.adminEmailImpersonatingUser })}
        </div>
      )}
      <div className={clsx(styles.dontShowOnTabletOrDesktop, styles.dropdownMenuItem)}>
        <strong>{t("header.myIDealwineMenu.usernameTitle", { username: user?.username })}</strong>
      </div>
      <strong className={clsx(styles.dontShowOnMobile, styles.dropdownMenuItem)}>
        {t("header.myIDealwineMenu.usernameTitle", { username: user?.username })}
      </strong>
      <div className={styles.dropdownMenuItem}>
        <TranslatableLink onClick={close} href="MY_IDEALWINE_HOME_URL">
          {t("header.myIDealwineMenu.myAccount")}
        </TranslatableLink>
        {isNonEmptyString(myIdealwineLogo) && (
          <Image src={myIdealwineLogo} alt="" width={20} height={14} />
        )}
      </div>
      <div className={styles.dropdownMenuItem}>
        <TranslatableLink onClick={close} href="BASKET_URL">
          {t("header.myIDealwineMenu.pendingOrders")}
        </TranslatableLink>
      </div>
      <div className={styles.dropdownMenuItem}>
        <TranslatableLink onClick={close} href="HISTORICAL_ORDERS">
          {t("header.myIDealwineMenu.orderHistoric")}
        </TranslatableLink>
      </div>
      <div className={styles.dropdownMenuItem}>
        <TranslatableLink onClick={close} href="BIDS_HISTORY">
          {t("header.myIDealwineMenu.historyOrdersBids")}
        </TranslatableLink>
      </div>
      <div className={styles.dropdownMenuItem}>
        <TranslatableLink onClick={close} href="MY_SELLER_INFORMATION">
          {t("header.myIDealwineMenu.myWineSales")}
        </TranslatableLink>
      </div>
      <div className={styles.dropdownMenuItem}>
        <TranslatableLink onClick={close} href="MY_STORED_LOTS">
          {t("header.myIDealwineMenu.myStoredLots")}
        </TranslatableLink>
      </div>
      <div className={styles.dropdownMenuItem}>
        <TranslatableLink onClick={close} href="MY_CAVE_URL">
          {t("header.myIDealwineMenu.myCellar")}
        </TranslatableLink>
      </div>
      <div className={styles.dropdownMenuItem}>
        <TranslatableLink onClick={close} href="MY_ALERTS_URL">
          {t("header.myIDealwineMenu.alertsWatch")}
        </TranslatableLink>
      </div>
      <div className={styles.dropdownMenuItem}>
        <Button variant="primaryBlack" onClick={logout} className={styles.logoutButton}>
          {t("login.logout")}
        </Button>
      </div>
    </Popover>
  );
};

export default MyIDealwineButton;
