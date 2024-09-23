import clsx from "clsx";
import React, { Fragment } from "react";

import MenuTab from "@/components/molecules/MenuTab";
import { translatedLinksKeys } from "@/urls/linksTranslation";

import styles from "./TabsMenu.module.scss";

type MenuPropsType<T extends translatedLinksKeys> = {
  tabs: Record<T, TabType>;
  currentTab: T;
  activeTabIsTitle?: boolean;
};

type TabType = {
  href: translatedLinksKeys;
  tab: string;
};

export enum ALERTS_TAB {
  WATCHLIST_URL = "WATCHLIST_URL",
  MY_ALERTS_URL = "MY_ALERTS_URL",
  ADD_ALERT_URL = "ADD_ALERT_URL",
}

export const AlertsTabs: Record<ALERTS_TAB, TabType> = {
  [ALERTS_TAB.WATCHLIST_URL]: {
    href: "WATCHLIST_URL",
    tab: "alerts:tabs.watch",
  },
  [ALERTS_TAB.ADD_ALERT_URL]: {
    href: "ADD_ALERT_URL",
    tab: "alerts:tabs.add-alert",
  },
  [ALERTS_TAB.MY_ALERTS_URL]: {
    href: "MY_ALERTS_URL",
    tab: "alerts:tabs.my-alerts",
  },
};

export enum SELLER_TAB {
  MY_SELLER_INFORMATION = "MY_SELLER_INFORMATION",
  ONGOING_SELLS = "ONGOING_SELLS",
  HISTORICAL_SELLS = "HISTORICAL_SELLS",
  SELL_MY_BOTTLES = "SELL_MY_BOTTLES",
}

export enum HISTORY_TAB {
  BUY_HISTORY = "BUY_HISTORY",
  BIDS_HISTORY = "BIDS_HISTORY",
  ONGOING_BIDS = "ONGOING_BIDS",
}

export const SellerTabs: Record<SELLER_TAB, TabType> = {
  [SELLER_TAB.MY_SELLER_INFORMATION]: {
    href: "MY_SELLER_INFORMATION",
    tab: "section-vendeur:mySellerInformation",
  },
  [SELLER_TAB.ONGOING_SELLS]: {
    href: "ONGOING_SELLS",
    tab: "section-vendeur:ongoingSells",
  },
  [SELLER_TAB.HISTORICAL_SELLS]: {
    href: "HISTORICAL_SELLS",
    tab: "section-vendeur:historicalSells",
  },
  [SELLER_TAB.SELL_MY_BOTTLES]: {
    href: "SELL_MY_BOTTLES",
    tab: "section-vendeur:sellMyBottles",
  },
};

export enum STOCK_TAB {
  MY_STORED_LOTS = "MY_STORED_LOTS",
  MY_STORED_LOTS_HISTORY = "MY_STORED_LOTS_HISTORY",
}

export const StockTabs: Record<STOCK_TAB, TabType> = {
  [STOCK_TAB.MY_STORED_LOTS]: {
    href: "MY_STORED_LOTS",
    tab: "lots-en-stock:myStoredLots",
  },
  [STOCK_TAB.MY_STORED_LOTS_HISTORY]: {
    href: "MY_STORED_LOTS_HISTORY",
    tab: "lots-en-stock:myStoredLotsHistory",
  },
};

export const HistoryTabs: Record<HISTORY_TAB, TabType> = {
  [HISTORY_TAB.BUY_HISTORY]: {
    href: "BUY_HISTORY",
    tab: "historique:buyHistory",
  },
  [HISTORY_TAB.BIDS_HISTORY]: {
    href: "BIDS_HISTORY",
    tab: "historique:bidsHistory",
  },
  [HISTORY_TAB.ONGOING_BIDS]: {
    href: "ONGOING_BIDS",
    tab: "historique:ongoingBids",
  },
};

const TabsMenu = <T extends translatedLinksKeys>({
  tabs,
  currentTab,
  activeTabIsTitle,
}: MenuPropsType<T>): JSX.Element => {
  const tabsKeys = Object.keys(tabs) as T[];

  return (
    <div className={styles.sellerMenu}>
      {tabsKeys.map((tabKey, index) => {
        const element = tabs[tabKey];

        return (
          <Fragment key={element.href}>
            <MenuTab
              href={element.href}
              tab={element.tab}
              isActive={currentTab === element.href}
              activeTabIsTitle={activeTabIsTitle}
            />
            {index !== tabsKeys.length - 1 && (
              <div className={clsx(styles.outline, styles.dontShowOnMobile)} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default TabsMenu;
