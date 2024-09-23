import { faInfoCircle } from "@fortawesome/pro-light-svg-icons/faInfoCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";

import Button from "@/components/atoms/Button/Button";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useGetAuctionItemDTOItem } from "@/networking/sylius-api-client/auction-item-dt-o/auction-item-dt-o";
import { addNdays, getDayOfWeek } from "@/utils/datesHandler";
import { millilitersToLiters } from "@/utils/formatHandler";
import { useTranslation } from "@/utils/next-utils";

import DeliveryDelayDialog from "../DeliveryDelayDialog/DeliveryDelayDialog";
import styles from "./OrderPanelStock.module.scss";

type Props = {
  productVariant: ProductVariantJsonldShopProductVariantRead;
};

const OrderPanelStock = ({ productVariant }: Props) => {
  const { t, lang } = useTranslation("acheter-vin");

  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  const handleInfoButtonClick = () => {
    setOpenInfoDialog(true);
  };

  const { data: auctionItem } = useGetAuctionItemDTOItem(
    productVariant.auction ? productVariant.code : "", // string is voluntary empty, it does not trigger a call
  );

  /** this should never happen as we return a 404 in getStaticProps if the auctionItem does not exist  */
  if (productVariant.auction && auctionItem === undefined) {
    throw new Error("auctionItem is undefined");
  }

  const now = new Date();

  const addNonWorkableDaysIfNecessary = (date: Date) => {
    const dayOfWeek = getDayOfWeek(date);

    switch (dayOfWeek) {
      case 6:
        return addNdays(date, 2);
      case 7:
        return addNdays(date, 1);
      default:
        return date;
    }
  };

  const referenceDate =
    productVariant.auction && typeof auctionItem?.auctionCatalog?.endDate === "string"
      ? new Date(auctionItem.auctionCatalog.endDate)
      : now;

  const calculateDayMin = (express: boolean) => {
    const initalDateMin = addNdays(referenceDate, express ? 2 : 4);
    const minDate = addNonWorkableDaysIfNecessary(initalDateMin);

    return minDate;
  };

  const dateMin = calculateDayMin(false).toLocaleDateString(lang);
  const dateMax = addNonWorkableDaysIfNecessary(
    addNdays(calculateDayMin(false), 3),
  ).toLocaleDateString(lang);

  const totalVolume = productVariant.volume ?? 0;
  const numberOfBottles = productVariant.numberOfBottles ?? 1;
  const unitVolume = Math.round(totalVolume / numberOfBottles);
  const showAdditionalDeliveryFees = millilitersToLiters(unitVolume) >= 3;
  const isOnFrenchSite = lang === "fr";
  const showDeliveryDelayDialog = isOnFrenchSite;

  const dateExpressMin = calculateDayMin(true).toLocaleDateString(lang);
  const dateExpressMax = addNonWorkableDaysIfNecessary(
    addNdays(calculateDayMin(true), getDayOfWeek(now) === 7 ? 1 : 2),
  ).toLocaleDateString(lang);

  return (
    <>
      {showAdditionalDeliveryFees && (
        <p className={clsx(styles.additionalDeliveryFees, styles.dontShowOnMobile)}>
          {t("additionalDeliveryFees")}
        </p>
      )}
      {showDeliveryDelayDialog && (
        <p className={clsx(styles.estimatedDelivery, styles.dontShowOnMobile)}>
          {t("estimatedDelivery", {
            dateMin: dateMin,
            dateMax: dateMax,
          })}{" "}
          <Button variant="inline" onClick={handleInfoButtonClick}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Button>
          <DeliveryDelayDialog
            open={openInfoDialog}
            setOpen={setOpenInfoDialog}
            dateMin={dateMin}
            dateMax={dateMax}
            dateExpressMin={dateExpressMin}
            dateExpressMax={dateExpressMax}
          />
        </p>
      )}
    </>
  );
};

export default OrderPanelStock;
