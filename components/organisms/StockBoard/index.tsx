import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price";
import TooltipCustom from "@/components/molecules/Tooltip/Tooltip";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { getVariantTitleAndQuantity } from "@/domain/productVariant";
import {
  StockSellerRequestDTOJsonldRequest as SellerRequestEnum,
  StoredItemDTOJsonldShopCustomerProductVariantRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { usePostStockCollection } from "@/networking/sylius-api-client/stock/stock";
import { getGetCustomerStoredItemsStoredItemDTOCollectionQueryKey } from "@/networking/sylius-api-client/stored-item-dt-o/stored-item-dt-o";
import { getGetTotalStoredItemDtoItemQueryKey } from "@/networking/sylius-api-client/total-stored-item-dto/total-stored-item-dto";
import { getFormatDateWithoutTime } from "@/utils/datesHandler";
import { useTranslation } from "@/utils/next-utils";
import { isNotBlank, isNotNullNorUndefined } from "@/utils/ts-utils";

import StockDialog from "../StockDialog/StockDialog";
import styles from "./StockBoard.module.scss";

type Props = {
  storedItems: StoredItemDTOJsonldShopCustomerProductVariantRead[];
};

const getSuccessTranslationKey = (sellerRequestValue: SellerRequestEnum): string => {
  switch (sellerRequestValue) {
    case SellerRequestEnum.SELL_REQUEST:
      return "sellRequestSuccess";
    case SellerRequestEnum.DELIVERY_REQUEST:
      return "deliveryRequestSuccess";
    default:
      return "success";
  }
};

const StockBoard = ({ storedItems }: Props): JSX.Element => {
  const [isStockModalOpen, setIsStockModalOpen] = useState<boolean>(false);
  const [sellerRequest, setSellerRequest] = useState<SellerRequestEnum | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [variantCodesToRequest, setVariantCodesToRequest] = useState<string[]>([]);

  const { t, lang } = useTranslation();
  const { user } = useAuthenticatedUserContext();

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = usePostStockCollection();

  const handleMultipleQuantityRequest =
    (sellerRequestValue: SellerRequestEnum) => async (wantedQuantity: number) => {
      const productVariantCodesToRequest = variantCodesToRequest.slice(0, wantedQuantity);

      await handleRequest(productVariantCodesToRequest, sellerRequestValue);
    };

  const handleRequest = async (
    productVariantCodes: string[],
    sellerRequestValue: SellerRequestEnum,
  ) => {
    try {
      await mutateAsync({
        data: {
          codes: productVariantCodes,
          request: sellerRequestValue,
        },
      });
      const successTranslationKey = getSuccessTranslationKey(sellerRequestValue);
      toast.success<string>(t(`lots-en-stock:${successTranslationKey}`));
      await queryClient.invalidateQueries({
        queryKey: getGetCustomerStoredItemsStoredItemDTOCollectionQueryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: getGetTotalStoredItemDtoItemQueryKey(user?.customerId ?? ""),
      });
      setSellerRequest(null);
      setVariantCodesToRequest([]);
      setQuantity(0);

      return;
    } catch (err) {
      toast.error<string>(t("lots-en-stock:error"));

      return;
    }
  };

  const handleButtonClick = async (
    itemQuantity: number,
    productVariantCodes: string[],
    sellerRequestValue: SellerRequestEnum,
  ) => {
    if (itemQuantity === 1) {
      return await handleRequest(productVariantCodes, sellerRequestValue);
    }

    setQuantity(itemQuantity);
    setVariantCodesToRequest(productVariantCodes);
    setSellerRequest(sellerRequestValue);
    setIsStockModalOpen(true);
  };

  const getShortCode = (code: string): string => {
    const uuidRegex = /([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/;
    if (uuidRegex.test(code)) {
      return code.split("-")[0].toUpperCase();
    }

    return code;
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("lots-en-stock:numLot")}</th>
              <th>{t("lots-en-stock:description")}</th>
              <th>{t("lots-en-stock:quantity")}</th>
              <th>{t("lots-en-stock:purchasePrice")}</th>
              <th>{t("lots-en-stock:storageStartDate")}</th>
              <th>{t("lots-en-stock:askForSale")}</th>
              <th>{t("lots-en-stock:askForDelivery")}</th>
            </tr>
          </thead>
          <tbody>
            {storedItems.map((storedItem: StoredItemDTOJsonldShopCustomerProductVariantRead) => {
              const storedItemQuantity = storedItem.quantity;

              const format = typeof storedItem.format === "string" ? storedItem.format : "INCONNU";

              const numberOfBottlesWithFormat = t(`common:enum.format.${format}`, {
                count: storedItem.numberOfBottles,
              });

              const description = getVariantTitleAndQuantity(
                numberOfBottlesWithFormat,
                storedItem.fullName,
              );

              const variants = storedItem.productVariants;

              const variantCodes = variants?.map(variant => variant.code) ?? [];

              const requestIsNotAllowed = storedItem.isProcessedByGamba === false;

              if (isNotNullNorUndefined(storedItemQuantity) && isNotNullNorUndefined(variants))
                return (
                  <tr key={storedItem.id}>
                    <td>
                      {isNotNullNorUndefined(storedItem.code) ? getShortCode(storedItem.code) : "-"}
                    </td>
                    <td className={styles.descriptionAndMiniature}>
                      <Image
                        className={styles.imageMiniature}
                        unoptimized
                        src={
                          isNotBlank(storedItem.productVariantImage)
                            ? storedItem.productVariantImage
                            : `/_no_picture_${lang}.jpg`
                        }
                        alt={storedItem.fullName ?? ""}
                        width={80}
                        height={80}
                      />
                      {storedItem.hasProductDetailPage === true ? (
                        <PdpLink variant={storedItem}>{description}</PdpLink>
                      ) : (
                        <p>{description}</p>
                      )}
                    </td>
                    <td>{storedItem.quantity}</td>
                    {/* Price is in cents, we want it in € */}
                    <td>
                      {isNotNullNorUndefined(storedItem.replacementAmount) &&
                      storedItem.replacementAmount !== 0 ? (
                        <Price size="small" price={storedItem.replacementAmount} />
                      ) : (
                        isNotNullNorUndefined(storedItem.purchasePrice) && (
                          <Price size="small" price={storedItem.purchasePrice} />
                        )
                      )}
                    </td>
                    <td>{getFormatDateWithoutTime(storedItem.storageStartDate, "fr")}</td>
                    <td>
                      <TooltipCustom
                        trigger={
                          <Button
                            disabled={requestIsNotAllowed}
                            variant="primaryGolden"
                            isLoading={isLoading}
                            onClick={async () => {
                              await handleButtonClick(
                                storedItemQuantity,
                                variantCodes,
                                SellerRequestEnum.SELL_REQUEST,
                              );
                            }}
                          >
                            {t("lots-en-stock:askForSale")}
                          </Button>
                        }
                      >
                        {requestIsNotAllowed && <span>{t("lots-en-stock:requestNotAllowed")}</span>}
                      </TooltipCustom>
                    </td>
                    <td>
                      <TooltipCustom
                        trigger={
                          <Button
                            disabled={requestIsNotAllowed}
                            variant="primaryGolden"
                            isLoading={isLoading}
                            onClick={async () => {
                              if (typeof storedItem.quantity === "number") {
                                await handleButtonClick(
                                  storedItemQuantity,
                                  variantCodes,

                                  SellerRequestEnum.DELIVERY_REQUEST,
                                );
                              }
                            }}
                          >
                            {t("lots-en-stock:askForDelivery")}
                          </Button>
                        }
                      >
                        {requestIsNotAllowed && <span>{t("lots-en-stock:requestNotAllowed")}</span>}
                      </TooltipCustom>
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
      {sellerRequest !== null && (
        <StockDialog
          open={isStockModalOpen}
          setOpen={setIsStockModalOpen}
          quantity={quantity}
          handleRequest={handleMultipleQuantityRequest(sellerRequest)}
        />
      )}
    </div>
  );
};

export default StockBoard;
