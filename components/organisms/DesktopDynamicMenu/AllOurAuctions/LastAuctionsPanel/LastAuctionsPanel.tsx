import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { useGetOrderEventHistoryCollection } from "@/networking/sylius-api-client/order-event-history/order-event-history";
import { useTranslation } from "@/utils/next-utils";

import styles from "./LastAuctionsPanel.module.scss";
import LastOrderCard from "./LastOrderCard/LastOrderCard";
type Props = {
  closeNavigationMenu: () => void;
  isActive: boolean;
};

const LastAuctionsPanel = ({ closeNavigationMenu, isActive }: Props) => {
  const { data: latestAuctionEvents } = useGetOrderEventHistoryCollection(
    {
      itemsPerPage: 6,
      auction: true,
    },
    {
      query: { enabled: isActive },
    },
  );

  const { t } = useTranslation("common");

  const totalAuctionEvents = latestAuctionEvents?.["hydra:totalItems"] ?? 0;

  const loadingDivs = Array.from({ length: 6 - totalAuctionEvents }, (_, index) => (
    <div key={index} className={styles.loading} />
  ));

  return latestAuctionEvents ? (
    <ul className={styles.listContainer}>
      <TranslatableLink
        href="LAST_ORDER_URL"
        className={styles.title}
        onClick={closeNavigationMenu}
      >
        <strong>{t(`header.dynamicMenu.lastOrders`)}</strong>
      </TranslatableLink>

      <li className={styles.lastOrdersContainer}>
        {latestAuctionEvents["hydra:member"].map(orderEvent => (
          <LastOrderCard
            key={orderEvent["@id"]}
            orderEvent={orderEvent}
            closeNavigationMenu={closeNavigationMenu}
          />
        ))}
        {loadingDivs}
      </li>
    </ul>
  ) : (
    <ul className={styles.listContainer}>
      <TranslatableLink
        href="LAST_ORDER_URL"
        className={styles.title}
        onClick={closeNavigationMenu}
      >
        <strong>{t(`header.dynamicMenu.lastOrders`)}</strong>
      </TranslatableLink>
      <li className={styles.lastOrdersContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.loading} />
        ))}
      </li>
    </ul>
  );
};

export default LastAuctionsPanel;
