import { faChevronLeft } from "@fortawesome/pro-light-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { faCircleArrowDown } from "@fortawesome/pro-light-svg-icons/faCircleArrowDown";
import { faCircleArrowUp } from "@fortawesome/pro-light-svg-icons/faCircleArrowUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PrismicLink } from "@prismicio/react";
import clsx from "clsx";
import React, { useState } from "react";

import { DynamicMenuTabDocumentData } from "@/.slicemachine/prismicio";
import Button from "@/components/atoms/Button/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { generateUrl } from "@/urls/linksTranslation";
import {
  dynamicMenuData,
  dynamicMenuLinks,
  isMustHaveLink,
  isServicePlus,
  MenuItem,
} from "@/utils/dynamicMenuConstants";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import ServicePanel from "../ServicePanel/ServicePanel";
import MobileAuctionItemList from "./MobileAuctionItemList/MobileAuctionItemList";
import styles from "./MobileDynamicMenu.module.scss";

type Props = {
  handleCloseDynamicMenu: () => void;
  dynamicMenuTab?: DynamicMenuTabDocumentData | null;
};

const MobileDynamicMenu = ({ handleCloseDynamicMenu, dynamicMenuTab }: Props) => {
  const { t, lang } = useTranslation("common");
  const [currentNavigationItems, setCurrentNavigationItems] = useState<MenuItem[]>(dynamicMenuData);
  const [showHomeButton, setShowHomeButton] = useState(false);

  const handleNavigation = (items: MenuItem[]) => {
    setCurrentNavigationItems(items);
    setShowHomeButton(true);
  };

  const handleHomeButton = () => {
    setCurrentNavigationItems(dynamicMenuData);
    setShowHomeButton(false);
  };

  const renderHomeButton = () => (
    <li className={styles.navigationItem}>
      <Button variant="inline" onClick={handleHomeButton} className={styles.navigator}>
        <FontAwesomeIcon icon={faChevronLeft} />
        {t("header.dynamicMenu.backMenu")}
      </Button>
    </li>
  );

  const LinkItem = ({ item }: { item: MenuItem }) => {
    const label = item.label;
    if (label === "weeklyShowcase") {
      if (isNotNullNorUndefined(dynamicMenuTab) && isNotNullNorUndefined(dynamicMenuTab.url)) {
        return (
          <PrismicLink onClick={handleCloseDynamicMenu} field={dynamicMenuTab.url}>
            {dynamicMenuTab.label}
          </PrismicLink>
        );
      } else {
        return <>⚠️ Missing weekly showcase link</>;
      }
    }

    if (!(label in dynamicMenuLinks)) {
      return <>⚠️ Missing link for {label} in dynamicMenuLinks</>;
    }
    const typedLabel = label as keyof typeof dynamicMenuLinks;

    if (item.label === "auctionCatalogs") {
      return <MobileAuctionItemList closeNavigationMenu={handleCloseDynamicMenu} />;
    }

    const shouldBePlpUrl = dynamicMenuLinks[typedLabel].pageKey === "BUY_WINE_URL";

    return (
      <TranslatableLink
        href={
          shouldBePlpUrl
            ? getPlpUrl(dynamicMenuLinks[typedLabel].params, lang)
            : generateUrl(dynamicMenuLinks[typedLabel].pageKey, lang)
        }
        className={clsx(
          styles.redirectLinkItem,
          isMustHaveLink(label) && styles.goldenSection,
          isServicePlus(label) ? styles.spacingServicesPlus : styles.spacingOtherServices,
        )}
        onClick={handleCloseDynamicMenu}
        dontTranslate
      >
        <Button variant="inline" className={styles.linkButton}>
          {isServicePlus(label) ? <ServicePanel label={label} /> : t(`header.dynamicMenu.${label}`)}
        </Button>
      </TranslatableLink>
    );
  };

  const SectionItem = ({ item }: { item: MenuItem }) => (
    <details className={styles.details}>
      <summary className={styles.summary}>
        {t(`header.dynamicMenu.${item.label}`)}
        <FontAwesomeIcon className={styles.arrowUp} icon={faCircleArrowUp} />
        <FontAwesomeIcon className={styles.arrowDown} icon={faCircleArrowDown} />
      </summary>
      {item.items?.map((subItem, subItemIndex) => (
        <li key={subItemIndex} className={styles.navgationSubitem}>
          {<LinkItem item={subItem} />}
        </li>
      ))}
    </details>
  );

  const NavigatorItem = ({ item }: { item: MenuItem }) => (
    <Button
      variant="icon"
      onClick={() => handleNavigation(item.items ?? [])}
      className={styles.navigator}
    >
      {t(`header.dynamicMenu.${item.label}`)}
      <FontAwesomeIcon icon={faChevronRight} />
    </Button>
  );

  return (
    <div className={styles.navigationMenuRoot}>
      <ul>
        {showHomeButton && renderHomeButton()}
        {currentNavigationItems.map((item, itemIndex) => (
          <li key={itemIndex} className={styles.navigationItem}>
            {item.type === "link" && <LinkItem item={item} />}
            {item.type === "section" && <SectionItem item={item} />}
            {item.type === "navigator" && <NavigatorItem item={item} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileDynamicMenu;
