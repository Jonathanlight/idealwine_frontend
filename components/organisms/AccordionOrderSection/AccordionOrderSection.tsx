import { faHourglassClock } from "@fortawesome/pro-light-svg-icons/faHourglassClock";
import { faCircleChevronDown } from "@fortawesome/pro-thin-svg-icons/faCircleChevronDown";
import { faCircleChevronUp } from "@fortawesome/pro-thin-svg-icons/faCircleChevronUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUpdateEffect } from "@react-hookz/web";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

import GoldenCheckbox from "@/components/atoms/GoldenCheckbox";
import Price from "@/components/molecules/Price";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useFullPageLoaderContext } from "@/context/FullPageLoaderContext/useFullPageLoaderContext";
import { OrderJsonldShopOrderRead } from "@/networking/sylius-api-client/.ts.schemas";
import {
  useShopAddListGroupedOrderOrderItem,
  useShopDeleteListGroupedOrderOrderItem,
} from "@/networking/sylius-api-client/order/order";
import { useTranslation } from "@/utils/next-utils";
import { isPaid } from "@/utils/orderUtils";

import NotDeliveredOrderCartLine, {
  CountriesNameByCode,
} from "../NotDeliveredOrderCartLine/NotDeliveredOrderCartLine";
import styles from "./AccordionOrderSection.module.scss";

type Props = {
  orders: OrderJsonldShopOrderRead[];
  countriesNameByCode: CountriesNameByCode;
  orderGroupTitle: string;
  onCompatibiliyError: (value: boolean) => void;
  canToggleItems?: boolean;
};

const AccordionOrderSection = ({
  orders,
  orderGroupTitle,
  onCompatibiliyError,
  canToggleItems = true,
}: Props) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(orders.some(item => isPaid(item)));

  const { setIsFullPageLoaderOpen } = useFullPageLoaderContext();

  const { cart, setCart } = useAuthenticatedUserContext();

  const tokenValue = cart?.tokenValue ?? "";
  const groupedOrderIds = orders.map(item => String(item.id));

  const { mutateAsync: deleteGroupedOrderItem, isLoading: isDeletingGroupedOrder } =
    useShopDeleteListGroupedOrderOrderItem();

  const { mutateAsync: addGroupedOrderItem, isLoading: isAddingGroupedOrder } =
    useShopAddListGroupedOrderOrderItem();

  const handleCheck = async () => {
    try {
      const newCart = await (isSelected ? deleteGroupedOrderItem : addGroupedOrderItem)({
        tokenValue,
        data: { groupedOrderIds },
      });
      setCart(newCart);
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.headers["idw-error"] === "incompatible-countries-grouping"
      ) {
        onCompatibiliyError(true);
      } else if (isAxiosError(error) && error.response?.status === 403) {
        toast.error<string>(t("panier:forbidden"));
      } else {
        toast.error<string>(t("panier:errorOccurred"));
      }
    }
  };

  useUpdateEffect(() => {
    setIsFullPageLoaderOpen(isAddingGroupedOrder || isDeletingGroupedOrder);
  }, [isAddingGroupedOrder, isDeletingGroupedOrder, setIsFullPageLoaderOpen]);

  const totalNumberOfbottles = orders.reduce(
    (sum, command) => sum + (command.numberOfBottles ?? 0),
    0,
  );
  const totalPrice = orders.reduce((sum, command) => sum + (command.itemsTotal ?? 0), 0);

  const isSelected = orders.every(order =>
    cart?.groupedOrders?.some(groupedOrder => groupedOrder.id === order.id),
  );

  return (
    <div className={styles.accordionGroup}>
      <div className={styles.accordionHeader}>
        <div className={styles.accordionHeaderMain}>
          {canToggleItems ? (
            <GoldenCheckbox checked={!!isSelected} size="lg" onClick={handleCheck} />
          ) : (
            <FontAwesomeIcon icon={faHourglassClock} size="lg" className={styles.goldenLogo} />
          )}
          <div className={styles.accordionHeaderTitle}>
            <span className={styles.orderGroupTitle}>{orderGroupTitle}</span>
            <span>
              {t(`common:enum.format.BOUTEILLE`, {
                count: totalNumberOfbottles,
              })}
            </span>
            <div className={styles.accordionHeaderPrice}>
              {t(`checkout-common:amountTotal`)}
              <Price price={totalPrice} size={"small"} />
            </div>
          </div>
          <FontAwesomeIcon
            onClick={() => setShowDetails(!showDetails)}
            size="lg"
            icon={showDetails ? faCircleChevronUp : faCircleChevronDown}
          />
        </div>
      </div>
      {showDetails && (
        <div>
          {orders.map(order => (
            <NotDeliveredOrderCartLine key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccordionOrderSection;
