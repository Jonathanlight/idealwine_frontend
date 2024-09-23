import clsx from "clsx";
import { useState } from "react";

import { DynamicMenuTabDocumentData } from "@/.slicemachine/prismicio";
import Button from "@/components/atoms/Button/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import Drawer from "@/components/molecules/Drawer/Drawer";
import Popover from "@/components/molecules/Popover";
import { useTranslation } from "@/utils/next-utils";

import MobileDynamicMenu from "../../MobileDynamicMenu/MobileDynamicMenu";
import styles from "./Header.module.scss";
type Props = { className?: string; dynamicMenuTab?: DynamicMenuTabDocumentData | null };

const IDealwineServices = ({ className, dynamicMenuTab }: Props) => {
  const { t } = useTranslation("common");
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [dropdown3Open, setDropdown3Open] = useState(false);

  const closeDropdown1 = () => setDropdown1Open(false);
  const closeDropdown2 = () => setDropdown2Open(false);
  const closeDropdown3 = () => setDropdown3Open(false);
  const [isMobileDynamicMenuOpen, setIsMobileDynamicMenuOpen] = useState(false);

  const handleCloseDynamicMenu = () => {
    setIsMobileDynamicMenuOpen(false);
  };

  return (
    <ul className={clsx(styles.idealwineServices, className)}>
      <li className={clsx(styles.idealwineService, styles.dontShowOnTabletOrDesktop)}>
        <Button variant="inline" onClick={() => setIsMobileDynamicMenuOpen(true)}>
          {t("header.buy")}
        </Button>
      </li>
      <li className={styles.idealwineService}>
        <Popover
          open={dropdown1Open}
          onOpenChange={setDropdown1Open}
          trigger={
            <Button
              variant="inline"
              className={clsx(styles.buttonDropdownIdealwineServices, styles.golden)}
            >
              <span className={styles.dontShowOnTabletOrDesktop}>{t("header.sell")}</span>
              <span className={styles.dontShowOnMobile}>{t("header.sellMyWine")}</span>
            </Button>
          }
          className={styles.dropdownIdealwineServices}
        >
          <div className={styles.dropdownItemIdealwineServices}>
            <TranslatableLink onClick={closeDropdown1} href="SELL_MY_WINES_URL">
              {t("header.saleService")}
            </TranslatableLink>
          </div>
          <div className={styles.dropdownItemIdealwineServices}>
            <TranslatableLink onClick={closeDropdown1} href="FREE_WINE_ESTIMATION_URL">
              {t("header.estimationService")}
            </TranslatableLink>
          </div>
        </Popover>
      </li>
      <li className={styles.idealwineService}>
        <Popover
          open={dropdown2Open}
          onOpenChange={setDropdown2Open}
          trigger={
            <Button variant="inline" className={styles.buttonDropdownIdealwineServices}>
              <span className={styles.dontShowOnTabletOrDesktop}>{t("header.ratings")}</span>
              <span className={styles.dontShowOnMobile}>{t("header.wineRatings")}</span>
            </Button>
          }
          className={styles.dropdownIdealwineServices}
        >
          <div className={styles.dropdownItemIdealwineServices}>
            <TranslatableLink onClick={closeDropdown2} href="VINTAGE_RATING_URL">
              {t("header.ratingSearchService")}
            </TranslatableLink>
          </div>
          <div className={styles.dropdownItemIdealwineServices}>
            <TranslatableLink onClick={closeDropdown2} href="WINE_INVESTMENT_URL">
              {t("header.wineRankingService")}
            </TranslatableLink>
          </div>
        </Popover>
      </li>
      <li className={styles.idealwineService}>
        <Popover
          open={dropdown3Open}
          onOpenChange={setDropdown3Open}
          trigger={
            <Button variant="inline" className={styles.buttonDropdownIdealwineServices}>
              <span className={styles.dontShowOnTabletOrDesktop}>{t("header.encyclopedia")}</span>
              <span className={styles.dontShowOnMobile}>{t("header.wineGuide")}</span>
            </Button>
          }
          className={styles.dropdownIdealwineServices}
        >
          <div className={styles.dropdownItemIdealwineServices}>
            <TranslatableLink onClick={closeDropdown3} href="WINE_GUIDE_URL">
              {t("header.wineGuideService")}
            </TranslatableLink>
          </div>
          <div className={styles.dropdownItemIdealwineServices}>
            <TranslatableLink onClick={closeDropdown3} href="VINTAGE_SAGA_URL">
              {t("header.vintageGuideService")}
            </TranslatableLink>
          </div>
          <div className={styles.dropdownItemIdealwineServices}>
            <TranslatableLink onClick={closeDropdown3} href="BOTTLE_FORMATS">
              {t("header.bottleFormatService")}
            </TranslatableLink>
          </div>
          <div className={styles.dropdownItemIdealwineServices}>
            <TranslatableLink onClick={closeDropdown3} href="DISCOVERY_WINE_VARIETIES">
              {t("header.mainWineVarietiesService")}
            </TranslatableLink>
          </div>
        </Popover>
      </li>
      <Drawer
        open={isMobileDynamicMenuOpen}
        onOpenChange={setIsMobileDynamicMenuOpen}
        className={styles.drawer}
      >
        <MobileDynamicMenu
          handleCloseDynamicMenu={handleCloseDynamicMenu}
          dynamicMenuTab={dynamicMenuTab}
        />
      </Drawer>
    </ul>
  );
};

export default IDealwineServices;
