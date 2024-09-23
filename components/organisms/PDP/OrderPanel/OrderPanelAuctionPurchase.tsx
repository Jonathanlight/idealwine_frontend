import { useMountEffect } from "@react-hookz/web";
import { useEffect, useState } from "react";

import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useGetAuctionItemDTOItem } from "@/networking/sylius-api-client/auction-item-dt-o/auction-item-dt-o";
import { isAuctionFinished } from "@/utils/auctionUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined, isNullOrUndefined } from "@/utils/ts-utils";

import AuctionCountdown from "../AuctionCountdown";
import { AuctionPrice } from "./AuctionPrice/AuctionPrice";
import styles from "./OrderPanelAuctionPurchase.module.scss";
import OrderPanelStock from "./OrderPanelStock";

type Props = {
  productVariant: ProductVariantJsonldShopProductVariantRead;
};

const REMAINING_TIME_THRESHOLD_FOR_FAST_AUTO_REFRESH = 1000 * 60 * 6; // 6 minutes in milliseconds
const FAST_AUTH_REFRESH_INTERVAL = 1000 * 3; // 3 seconds in milliseconds
const SLOW_AUTH_REFRESH_INTERVAL = 1000 * 15; // 15 seconds in milliseconds
const REFETCH_SECURITY_MARGIN_AFTER_AUCTION_END = 2 * FAST_AUTH_REFRESH_INTERVAL;

const OrderPanelAuctionPurchase = ({ productVariant }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");
  const { user } = useAuthenticatedUserContext();
  const [refetchInterval, setRefetchInterval] = useState<number>();

  const hasStock = productVariant.inStock ?? false;

  const { data: auctionItem, refetch } = useGetAuctionItemDTOItem(productVariant.code, {
    query: { refetchOnWindowFocus: refetchInterval !== FAST_AUTH_REFRESH_INTERVAL },
  });

  const [clientAndServerTimeDifference, setClientAndServerTimeDifference] = useState(0);

  /** this should never happen as we return a 404 in getStaticProps if the auctionItem does not exist  */
  if (auctionItem === undefined) throw new Error("auctionItem is undefined");

  const isFinished =
    isAuctionFinished(auctionItem, clientAndServerTimeDifference) &&
    refetchInterval !== FAST_AUTH_REFRESH_INTERVAL;

  useMountEffect(() => {
    void refetch();
  });

  useEffect(() => {
    if (auctionItem.serverTimeMilliseconds === undefined) return;

    const newClientAndServerTimeDifference = auctionItem.serverTimeMilliseconds - Date.now();

    if (Math.abs(newClientAndServerTimeDifference - clientAndServerTimeDifference) > 1000) {
      setClientAndServerTimeDifference(newClientAndServerTimeDifference);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionItem.serverTimeMilliseconds]);

  useEffect(() => {
    if (user || isNullOrUndefined(auctionItem.endDate)) {
      return;
    }

    const remainingTime =
      new Date(auctionItem.endDate).getTime() - (Date.now() + clientAndServerTimeDifference);

    if (remainingTime <= -REFETCH_SECURITY_MARGIN_AFTER_AUCTION_END) return;

    const timeout = setTimeout(() => {
      void refetch();
    }, remainingTime + REFETCH_SECURITY_MARGIN_AFTER_AUCTION_END);

    return () => clearTimeout(timeout);
  }, [auctionItem.endDate, clientAndServerTimeDifference, refetch, user]);

  useEffect(() => {
    if (!user || isNullOrUndefined(auctionItem.endDate)) {
      setRefetchInterval(undefined);

      return;
    }

    const remainingTime =
      new Date(auctionItem.endDate).getTime() - (Date.now() + clientAndServerTimeDifference);
    if (remainingTime > REMAINING_TIME_THRESHOLD_FOR_FAST_AUTO_REFRESH) {
      setRefetchInterval(SLOW_AUTH_REFRESH_INTERVAL);

      const timeout = setTimeout(() => {
        setRefetchInterval(FAST_AUTH_REFRESH_INTERVAL);
      }, remainingTime - REMAINING_TIME_THRESHOLD_FOR_FAST_AUTO_REFRESH);

      return () => clearTimeout(timeout);
    } else if (remainingTime > -REFETCH_SECURITY_MARGIN_AFTER_AUCTION_END) {
      setRefetchInterval(FAST_AUTH_REFRESH_INTERVAL);

      const timeout = setTimeout(() => {
        setRefetchInterval(undefined);
      }, remainingTime + REFETCH_SECURITY_MARGIN_AFTER_AUCTION_END);

      return () => clearTimeout(timeout);
    }
  }, [auctionItem.endDate, clientAndServerTimeDifference, user]);

  useEffect(() => {
    if (refetchInterval === undefined) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") void refetch();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetch, refetchInterval]);

  return (
    <>
      <div>
        {isFinished && isNotNullNorUndefined(auctionItem.highestBid) && (
          <span className={styles.desktopSold}>{t("sold")}</span>
        )}
        {auctionItem.serverTimeMilliseconds !== undefined && (
          <AuctionCountdown
            auctionItem={auctionItem}
            isFinished={isFinished}
            clientAndServerTimeDifference={clientAndServerTimeDifference}
          />
        )}
      </div>

      <AuctionPrice
        productVariant={productVariant}
        auctionItem={auctionItem}
        isFinished={isFinished}
        showLiveIndicator={refetchInterval !== undefined}
      />
      {isFinished && <p className={styles.additionalDeliveryFees}>{t("additionalDeliveryFees")}</p>}
      {hasStock && !isFinished && <OrderPanelStock productVariant={productVariant} />}
    </>
  );
};

export default OrderPanelAuctionPurchase;
