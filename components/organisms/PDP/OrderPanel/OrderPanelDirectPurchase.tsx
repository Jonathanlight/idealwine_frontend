import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import clsx from "clsx";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select/Select";
import SoonAvailableBanner from "@/components/atoms/SoonAvailableBanner";
import SoonAvailableBannerMobile from "@/components/atoms/SoonAvailableBannerMobile";
import DetailedPrice from "@/components/molecules/DetailedPrice";
import Price from "@/components/molecules/Price";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { useFindCustomsFeeRate } from "@/hooks/useFindCustomsFeeRate";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useShopAddItemOrderItem } from "@/networking/sylius-api-client/order/order";
import { getShopGetProductVariantItemQueryKey } from "@/networking/sylius-api-client/product-variant/product-variant";
import { cinzelFont, idealWineIconsFont } from "@/styles/fonts";
import { MAX_AVAILABLE_QUANTITY_TO_SHOW } from "@/utils/availableQuantity";
import { millilitersToLiters } from "@/utils/formatHandler";
import { sendCartUpdateGtmEvent, sendProductAddToCartGtmEvent } from "@/utils/gtmUtils";
import { ImageFilters, productVariantImageFiltersParameter } from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined, isNullOrUndefined } from "@/utils/ts-utils";

import NumberOfBottlesWithFormat from "../../NumberOfBottlesWithFormat";
import { NoStockOrderSection } from "./NoStockDirectPurchaseSection";
import styles from "./OrderPanel.module.scss";
import OrderPanelStock from "./OrderPanelStock";

type Props = {
  productVariant: ProductVariantJsonldShopProductVariantRead;
  setOpenShoppingCartConfirmationDialog: (value: boolean) => void;
  numberOfLotsSelected: number;
  setNumberOfLotsSelected: (value: number) => void;
  setRealNumberOfLotsSelected: (value: number) => void;
};

const OrderPanelDirectPurchase = ({
  productVariant,
  setOpenShoppingCartConfirmationDialog,
  numberOfLotsSelected,
  setNumberOfLotsSelected,
  setRealNumberOfLotsSelected,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { cart, setCart, user, isFetchCartLoading, setIsLoginModalOpen, fetchCart } =
    useAuthenticatedUserContext();
  const { mutateAsync, isLoading } = useShopAddItemOrderItem();
  const queryClient = useQueryClient();

  const hasStock = productVariant.inStock ?? false;
  const limitedQuantityPerOrder = productVariant.limitedQuantityPerOrder ?? 0;
  const hasLimitedQuantityPerOrder = limitedQuantityPerOrder !== 0;
  const onHand = productVariant.onHand ?? 0;
  const onHold = productVariant.onHold ?? 0;
  const availableStock = onHand - onHold;
  const showSoonAvailableBanner = !hasStock && productVariant.restockable;

  const { currentDeliveryCountry: deliveryCountry } = useCurrentDeliveryCountry();
  const price = productVariant.priceByCountry?.[deliveryCountry] ?? 0;
  const originalPrice = productVariant.originalPriceByCountry?.[deliveryCountry] ?? 0;

  const numberOfBottles = productVariant.numberOfBottles ?? 0;
  const totalVolume = millilitersToLiters(productVariant.volume ?? 0).toFixed(2);

  const hasUnitPrice = (productVariant.numberOfBottles ?? 0) > 1;
  const unitPrice = hasUnitPrice ? price / numberOfBottles : 0;

  const showSpecialPrice = isNotNullNorUndefined(productVariant.priceType);

  const numberOfIdenticalItemsInCart =
    cart?.items?.filter(item => item.variant.code === productVariant.code)[0]?.quantity ?? 0;

  const maxOptions = Math.min(
    MAX_AVAILABLE_QUANTITY_TO_SHOW,
    hasLimitedQuantityPerOrder
      ? Math.max(limitedQuantityPerOrder - numberOfIdenticalItemsInCart, 0)
      : MAX_AVAILABLE_QUANTITY_TO_SHOW,
    availableStock,
  );

  const customsFeeRate = useFindCustomsFeeRate(deliveryCountry);

  const numberOfLotsPriceDisplay = numberOfLotsSelected <= 0 ? 1 : numberOfLotsSelected;

  const showSelectMultipleLots = !productVariant.secondHand;

  const options = Array.from({ length: maxOptions }, (_, index) => {
    const lotNumber = index + 1;
    const label = t("acheter-vin:lotsDropbox.lots", { count: lotNumber });

    return { value: lotNumber.toString(), label };
  });

  const generateLotDiscountVariables = () => {
    const lotDiscountPercentage = productVariant.lotDiscountPercentage;
    const lotDiscountBottleNumber = productVariant.lotDiscountBottleNumber;

    if (
      isNullOrUndefined(lotDiscountPercentage) ||
      isNullOrUndefined(lotDiscountBottleNumber) ||
      lotDiscountPercentage <= 0 ||
      lotDiscountBottleNumber <= 0 ||
      onHand - onHold + numberOfIdenticalItemsInCart * 2 < lotDiscountBottleNumber
    ) {
      return { hasLotDiscount: false, price: price, reducedUnitPrice: price };
    }

    const reducedUnitPrice = price * (1 - lotDiscountPercentage / 100);

    return {
      hasLotDiscount: true,
      price: numberOfLotsSelected < lotDiscountBottleNumber ? price : reducedUnitPrice,
      reducedUnitPrice: price * (1 - lotDiscountPercentage / 100),
    };
  };

  const {
    hasLotDiscount,
    price: correctedPrice,
    reducedUnitPrice,
  } = generateLotDiscountVariables();

  const fullAmountPercentage = customsFeeRate?.fullAmountPercentage ?? 0;
  const priceByBottle = customsFeeRate?.priceByBottle ?? 0;
  const customsFeeAmount =
    fullAmountPercentage * correctedPrice + priceByBottle * (productVariant.numberOfBottles ?? 1);

  const format = isNotNullNorUndefined(productVariant.format)
    ? t(`enums:formatWithoutCount.${productVariant.format}`)
    : t("enums:formatWithoutCount.INCONNU");

  const formatWithQuantity = isNotNullNorUndefined(productVariant.format)
    ? t(`common:enum.format.${productVariant.format}`, {
        count: productVariant.limitedQuantityPerOrder,
      })
    : t("common:enum.format.INCONNU");

  const handleLotSelection = (selectedValue: string) => {
    setNumberOfLotsSelected(parseInt(selectedValue));
  };
  const handleBasketButtonClick = async (): Promise<void> => {
    try {
      const oldItemNumber =
        cart?.items?.find(item => item.variant.code === productVariant.code)?.quantity ?? 0;

      if (isNullOrUndefined(user)) {
        setIsLoginModalOpen(true);

        return;
      }

      let tokenValue = cart?.tokenValue;

      if (isNullOrUndefined(tokenValue)) {
        // cart failed to be fetched, fetch it again
        const fetchedCart = await fetchCart();

        tokenValue = fetchedCart?.tokenValue ?? "";
      }

      const newCart = await mutateAsync({
        data: { productVariant: productVariant["@id"], quantity: numberOfLotsSelected },
        tokenValue,
        params: { filter: [ImageFilters.CART] },
      });

      const newItemNumber =
        newCart.items?.find(item => item.variant.code === productVariant.code)?.quantity ?? 0;

      setRealNumberOfLotsSelected(newItemNumber - oldItemNumber);
      setOpenShoppingCartConfirmationDialog(true);
      setCart(newCart);
      sendProductAddToCartGtmEvent(newCart, deliveryCountry, t);
      sendCartUpdateGtmEvent(newCart);

      const updatedProductVariant = {
        ...productVariant,
        onHold: (productVariant.onHold ?? 0) + numberOfLotsSelected,
        inStock:
          (productVariant.onHand ?? 0) - (productVariant.onHold ?? 0) - numberOfLotsSelected > 0,
      };

      queryClient.setQueryData(
        getShopGetProductVariantItemQueryKey(
          productVariant.code,
          productVariantImageFiltersParameter,
        ),
        updatedProductVariant,
      );
    } catch (error) {
      if (!isAxiosError(error) || error.response?.status !== 401) {
        toast.error<string>(t("common:common.errorOccurred"));

        return;
      }
    }
  };

  return (
    <>
      {showSpecialPrice && (
        <div
          className={clsx(
            styles.specialOrImportantPrice,
            cinzelFont.className,
            styles.dontShowOnMobile,
          )}
        >
          <span className={clsx(idealWineIconsFont.className, styles.specialPriceIcon)}>P</span>
          {t(`acheter-vin:enum.priceType.${productVariant.priceType as string}`)}
        </div>
      )}
      {hasLotDiscount && (
        <div className={styles.lotDiscountContainer}>
          <div className={styles.lotDiscountFirstLine}>
            {t("acheter-vin:lotDiscountFirstLine", {
              percentage: productVariant.lotDiscountPercentage,
              quantity: productVariant.lotDiscountBottleNumber,
            })}
          </div>
          <div className={styles.lotDiscountSecondLine}>
            {t("acheter-vin:lotDiscountSecondLinePartOne")}{" "}
            <Price price={reducedUnitPrice} size="small" />{" "}
            {t("acheter-vin:lotDiscountSecondLinePartTwo")}
          </div>
        </div>
      )}
      <div className={styles.priceContainer}>
        {showSoonAvailableBanner && (
          <>
            <SoonAvailableBanner className={styles.dontShowOnMobile} />
            <SoonAvailableBannerMobile className={styles.showOnlyOnMobile} />
          </>
        )}
        {maxOptions === 0 && hasStock && (
          <span className={styles.allAvailableLotsSelected}>
            {t("acheter-vin:allStockAddedToBasket")}
          </span>
        )}
        <DetailedPrice
          price={correctedPrice * numberOfLotsPriceDisplay}
          size="big"
          originalPrice={originalPrice * numberOfLotsPriceDisplay}
          priceClassName={styles.price}
          hasStock={hasStock}
        />
        {hasStock && customsFeeAmount > 0 && (
          <div className={styles.customsFeeContainer}>
            <Price
              price={(correctedPrice + customsFeeAmount) * numberOfLotsPriceDisplay}
              size="small"
            />
            {" " + t("acheter-vin:customsFeeIncluded")}
          </div>
        )}
      </div>
      <div className={styles.basketInfoContainer}>
        {hasStock && showSelectMultipleLots && (
          <div className={clsx(styles.lotInfoContainer)}>
            <Select
              placeholder={t("acheter-vin:oneLot")}
              options={{
                groups: [{ key: t("acheter-vin:lots"), title: t("acheter-vin:lots"), options }],
              }}
              value={numberOfLotsSelected.toString()}
              onValueChange={handleLotSelection}
            />
            <div className={clsx(styles.dontShowOnMobile, styles.lotMulti)}>
              <div className={styles.boldCapital}>
                {format} {`(${totalVolume}L)`}
              </div>
              {hasLimitedQuantityPerOrder && (
                <div>
                  {t("acheter-vin:limitedQuantity", {
                    count: limitedQuantityPerOrder,
                    formatWithQuantity: formatWithQuantity,
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {hasStock && !showSelectMultipleLots && (
          <div className={styles.classicalLot}>
            <div className={styles.boldCapital}>
              <NumberOfBottlesWithFormat variant={productVariant} /> {`(${totalVolume}L)`}
            </div>
            {hasUnitPrice && (
              <p
                className={clsx(styles.lotDescription, styles.boldCapital, styles.dontShowOnMobile)}
              >
                {t("acheter-vin:unitPrice")} <Price price={unitPrice} size="small" />
              </p>
            )}
          </div>
        )}
        {hasStock ? (
          <Button
            variant="primaryBlack"
            onClick={handleBasketButtonClick}
            disabled={
              maxOptions === 0 ||
              numberOfLotsSelected === 0 ||
              (isNotNullNorUndefined(user) && isFetchCartLoading)
            }
            isLoading={isLoading}
            className={styles.addToBasketButton}
            id="formecaviste"
          >
            {t("acheter-vin:addToBasket")}
          </Button>
        ) : (
          <NoStockOrderSection productVariant={productVariant} />
        )}
      </div>
      {hasStock && <OrderPanelStock productVariant={productVariant} />}
    </>
  );
};

export default OrderPanelDirectPurchase;
