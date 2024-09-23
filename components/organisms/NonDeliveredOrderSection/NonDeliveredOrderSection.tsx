import { useState } from "react";

import {
  OrderJsonldShopOrderRead,
  OrderJsonldShopOrderReadSellType,
} from "@/networking/sylius-api-client/.ts.schemas";
import { getFormatDateWithoutTime } from "@/utils/datesHandler";
import { useTranslation } from "@/utils/next-utils";
import { sortOrdersBySellTypeDateAndCountry } from "@/utils/orderUtils";
import { isNonEmptyString } from "@/utils/ts-utils";

import AccordionOrderSection from "../AccordionOrderSection";
import IncompatibleOrderCountriesModal from "../GeneralCheckout/IncompatibleOrderCountries/IncompatibleOrderCountriesModal";
import { CountriesNameByCode } from "../NotDeliveredOrderCartLine/NotDeliveredOrderCartLine";
import styles from "./NonDeliveredOrderSection.module.scss";

type Props = {
  title: string;
  tooltip?: string;
  orders: OrderJsonldShopOrderRead[];
  countriesNameByCode: CountriesNameByCode;
  canToggleItems?: boolean;
};

type RegroupedOrders = {
  [key: string]: OrderJsonldShopOrderRead[] | undefined;
};

const getSellTypeKey = (sellType?: OrderJsonldShopOrderReadSellType) => {
  switch (sellType) {
    case OrderJsonldShopOrderReadSellType.AUCTION:
      return "auctionAtWithCountry";
    case OrderJsonldShopOrderReadSellType.DIRECT_SALE:
      return "directPurchaseAtWithCountry";
    case OrderJsonldShopOrderReadSellType.DELIVERY_REQUEST:
      return "deliveryRequestAt";
    default:
      return "directPurchaseAt";
  }
};

const NonDeliveredOrderSection = ({
  title,
  tooltip,
  orders,
  countriesNameByCode,
  canToggleItems = true,
}: Props) => {
  const { t } = useTranslation();
  const sortedOrders = sortOrdersBySellTypeDateAndCountry(orders);
  const [incompatibleOrderCountriesModalOpen, setIncompatibleOrderCountriesModalOpen] =
    useState(false);

  const regroupedOrders = sortedOrders.reduce((acc: RegroupedOrders, order) => {
    const checkoutCompletedDate = getFormatDateWithoutTime(order.checkoutCompletedAt ?? "", "fr");
    const deliveryCountryCode = order.shippingAddress?.countryCode ?? "MissingCountryCode";
    const deliveryCountry = countriesNameByCode[deliveryCountryCode] ?? deliveryCountryCode;
    const sellTypeKey = getSellTypeKey(order.sellType);
    const orderGroupTitle = t(`checkout-common:${sellTypeKey}`, {
      date: checkoutCompletedDate,
      country: deliveryCountry,
    });

    if (acc[orderGroupTitle]) {
      acc[orderGroupTitle]?.push(order);
    } else {
      acc[orderGroupTitle] = [order];
    }

    return acc;
  }, {});

  return (
    <div className={styles.mainContainer}>
      <IncompatibleOrderCountriesModal
        open={incompatibleOrderCountriesModalOpen}
        setOpen={setIncompatibleOrderCountriesModalOpen}
      />
      <div className={styles.myNonDeliveredOrdersContainer}>
        <div className={styles.myOrdersTitle}>
          <span className={styles.uppercase}>{title}</span>
          {isNonEmptyString(tooltip) && <span className={styles.myOrdersToolTip}>({tooltip})</span>}
        </div>
      </div>
      {Object.keys(regroupedOrders).map(orderGroupTitle => (
        <AccordionOrderSection
          key={orderGroupTitle}
          onCompatibiliyError={setIncompatibleOrderCountriesModalOpen}
          countriesNameByCode={countriesNameByCode}
          orderGroupTitle={orderGroupTitle}
          orders={regroupedOrders[orderGroupTitle] ?? []}
          canToggleItems={canToggleItems}
        />
      ))}
    </div>
  );
};

export default NonDeliveredOrderSection;
