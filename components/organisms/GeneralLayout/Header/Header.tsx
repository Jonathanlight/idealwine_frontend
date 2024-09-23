import { faGavel } from "@fortawesome/pro-light-svg-icons/faGavel";
import { faHeart } from "@fortawesome/pro-light-svg-icons/faHeart";
import { faShoppingBag } from "@fortawesome/pro-light-svg-icons/faShoppingBag";
import { faHeart as faHeartSolid } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";

import Button from "@/components/atoms/Button/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import SearchbarWithAlgolia from "@/components/molecules/Searchbar/SearchbarWithAlgolia";
import SearchbarWithoutAlgolia from "@/components/molecules/Searchbar/SearchbarWithoutAlgolia";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { HrefLangs } from "@/types/HrefLangs";
import { CommonPageProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import DesktopDynamicMenu from "../../DesktopDynamicMenu/DesktopDynamicMenu";
import DeliveryCountrySelector from "../DeliveryCountrySelector/DeliveryCountrySelector";
import LanguageAndCurrencySelector from "../LanguageAndCurrencySelector";
import MyIDealwineButton from "../MyIDealwineButton";
import styles from "./Header.module.scss";
import IDealwineServices from "./IDealwineServices";

type Props = {
  isOnPLP?: boolean;
  hrefLangs?: HrefLangs;
} & CommonPageProps;

const Header = ({ isOnPLP, hrefLangs, dynamicMenuTab, pageDynamicMenuPromotionBanner }: Props) => {
  const { t } = useTranslation("common");
  const { user, cart, wishlist, numberOfOngoingBids } = useAuthenticatedUserContext();
  const { pathname } = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.viewportContainer}>
        <div className={clsx(styles.contactContainer, styles.dontShowOnMobile)}>
          {/* empty div to center the div.contactLinkCentered with flex */}
          <div className={clsx(styles.leftFakeDiv, styles.dontShowOnMobileOrTablet)} />
          <div className={styles.contactLinkCentered}>
            <TranslatableLink href="CONTACT_URL" className={styles.link}>
              {t("header.collectionOnSite")} <Button variant="inline">{t("header.click")}</Button> |{" "}
              {t("header.wineAdvice")}{" "}
              <span className={styles.phoneNumber}>{t("header.phoneNumber")}</span>
            </TranslatableLink>
          </div>
          <div className={clsx(styles.rightPart, styles.dontShowOnMobile)}>
            <DeliveryCountrySelector />
          </div>
        </div>
        <div className={styles.actionsNavbar}>
          <TranslatableLink href="HOME_URL" className={styles.logoContainer}>
            <Image
              priority
              src="/logo-idealwine.svg"
              alt="iDealwine logo"
              width={150}
              height={40}
              className={styles.logo}
            />
          </TranslatableLink>
          {isOnPLP ? <SearchbarWithAlgolia /> : <SearchbarWithoutAlgolia />}
          <IDealwineServices className={styles.dontShowOnMobile} />

          <div className={styles.shopIcons}>
            {user && (
              <TranslatableLink href="WISHLIST_URL" className={styles.iconLink}>
                <FontAwesomeIcon
                  className={styles.shopIcon}
                  size="sm"
                  icon={wishlist.size > 0 ? faHeartSolid : faHeart}
                />
                <p className={styles.absoluteNumber}>{wishlist.size > 0 && wishlist.size}</p>
              </TranslatableLink>
            )}
            {user && (
              <TranslatableLink href="ONGOING_BIDS" className={styles.iconLink}>
                <FontAwesomeIcon className={styles.shopIcon} size="sm" icon={faGavel} />{" "}
                <p className={styles.absoluteNumber}>{numberOfOngoingBids}</p>
              </TranslatableLink>
            )}

            {user && (
              <TranslatableLink href="BASKET_URL" className={styles.iconLink}>
                <FontAwesomeIcon className={styles.shopIcon} size="sm" icon={faShoppingBag} />{" "}
                <p className={styles.absoluteNumber}>
                  {(cart?.items?.length ?? 0) > 0 &&
                    cart?.items?.reduce((acc, item) => acc + (item.quantity ?? 0), 0)}
                </p>
              </TranslatableLink>
            )}
            {!pathname.startsWith("/login") && <MyIDealwineButton />}
            <LanguageAndCurrencySelector isOnPLP={isOnPLP} hrefLangs={hrefLangs} />
          </div>
        </div>
        <div className={clsx(styles.thirdLine, styles.dontShowOnTabletOrDesktop)}>
          <IDealwineServices dynamicMenuTab={dynamicMenuTab} />
        </div>
        <DesktopDynamicMenu
          className={styles.dontShowOnMobile}
          dynamicMenuTab={dynamicMenuTab}
          pageDynamicMenuPromotionBanner={pageDynamicMenuPromotionBanner}
        />
      </div>
    </header>
  );
};

export default Header;
