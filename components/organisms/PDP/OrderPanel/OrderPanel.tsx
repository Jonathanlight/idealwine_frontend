import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

import LoyaltyProgramReduction from "@/components/atoms/LoyaltyProgramReduction/LoyaltyProgramReduction";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { getVariantVintageTitle } from "@/domain/productVariant";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { cinzelFont } from "@/styles/fonts";
import { MAX_AVAILABLE_QUANTITY_TO_SHOW } from "@/utils/availableQuantity";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import ShoppingCartConfirmationDialog from "../ShoppingCartConfirmationDialog";
import styles from "./OrderPanel.module.scss";
import OrderPanelAuctionPurchase from "./OrderPanelAuctionPurchase";
import OrderPanelDirectPurchase from "./OrderPanelDirectPurchase";

type Props = {
  productVariant: ProductVariantJsonldShopProductVariantRead;
};

const OrderPanel = ({ productVariant }: Props): JSX.Element => {
  const { t } = useTranslation();

  const [openShoppingCartConfirmationDialog, setOpenShoppingCartConfirmationDialog] =
    useState(false);
  const [realNumberOfLotsSelected, setRealNumberOfLotsSelected] = useState(0);
  const logoWindexPath = "/logo-winedex.png";
  const wineDexLink = "https://www.winedex.io/";

  const { user } = useAuthenticatedUserContext();

  const limitedQuantityPerOrder = productVariant.limitedQuantityPerOrder ?? 0;
  const onHand = productVariant.onHand ?? 0;
  const onHold = productVariant.onHold ?? 0;
  const availableStock = onHand - onHold;

  const isDirectPurchase = productVariant.auction === false;
  const isSecondHand = productVariant.secondHand ?? false;
  const hasLimitedQuantityPerOrder =
    isNotNullNorUndefined(productVariant.limitedQuantityPerOrder) &&
    productVariant.limitedQuantityPerOrder > 0;
  const hasWineIndexTag = productVariant.hasWineDexTag;
  const isVATrecoverable = productVariant.VATRecoverable ?? false;
  const isLotMulti = !isSecondHand;

  const loyaltyProgramReduction = user ? user.loyaltyProgram : "NONE";

  const maxOptions = Math.min(
    MAX_AVAILABLE_QUANTITY_TO_SHOW,
    hasLimitedQuantityPerOrder ? limitedQuantityPerOrder : MAX_AVAILABLE_QUANTITY_TO_SHOW,
    availableStock,
  );

  const [numberOfLotsSelected, setNumberOfLotsSelected] = useState(Math.min(1, maxOptions));

  useEffect(() => {
    if (openShoppingCartConfirmationDialog) return;
    if (maxOptions < numberOfLotsSelected) {
      setNumberOfLotsSelected(maxOptions);
    } else if (numberOfLotsSelected === 0 && maxOptions > 0) {
      setNumberOfLotsSelected(1);
    }
  }, [maxOptions, numberOfLotsSelected, openShoppingCartConfirmationDialog]);

  const showLoyaltyProgramReduction = isVATrecoverable && isLotMulti;
  const showStockWarning = availableStock === 1 && isLotMulti;
  const showWineIndexTag = hasWineIndexTag;

  return (
    <aside className={styles.auctionPanel}>
      <div
        className={clsx(styles.subContainer, !showLoyaltyProgramReduction && styles.justifyCenter)}
      >
        {showLoyaltyProgramReduction ? (
          <LoyaltyProgramReduction
            loyaltyProgram={loyaltyProgramReduction}
            className={clsx(styles.loyaltyProgram, styles.dontShowOnMobile)}
          />
        ) : (
          <div />
        )}
        <div className={styles.bannersContainer}>
          <ShoppingCartConfirmationDialog
            open={openShoppingCartConfirmationDialog}
            setOpen={setOpenShoppingCartConfirmationDialog}
            wineName={getVariantVintageTitle(productVariant) ?? ""}
            realNumberOfLotsSelected={realNumberOfLotsSelected}
            shouldDisplayLimitedQuantityWarning={numberOfLotsSelected > realNumberOfLotsSelected}
          />
          {showStockWarning && (
            <span className={clsx(styles.stockWarning, styles.dontShowOnMobile)}>
              <FontAwesomeIcon icon={faExclamationTriangle} /> {t("acheter-vin:stockWarning")}
            </span>
          )}
          {isDirectPurchase ? (
            <OrderPanelDirectPurchase
              productVariant={productVariant}
              setOpenShoppingCartConfirmationDialog={setOpenShoppingCartConfirmationDialog}
              numberOfLotsSelected={numberOfLotsSelected}
              setNumberOfLotsSelected={setNumberOfLotsSelected}
              setRealNumberOfLotsSelected={setRealNumberOfLotsSelected}
            />
          ) : (
            <OrderPanelAuctionPurchase productVariant={productVariant} />
          )}
          {showWineIndexTag && (
            <a
              href={wineDexLink}
              target="_blank"
              className={clsx(styles.dontShowOnMobile, styles.winedexContainer)}
              rel="noreferrer"
            >
              <Image src={logoWindexPath} alt="WineDex Tag" width={60} height={53} />
              <figcaption className={clsx(cinzelFont.className, styles.figcaption)}>
                {t("acheter-vin:authenticateWithNFC")}
                <br />
                {t("acheter-vin:winedexUrl")}
              </figcaption>
            </a>
          )}
        </div>
        <div />
      </div>
    </aside>
  );
};

export default OrderPanel;
