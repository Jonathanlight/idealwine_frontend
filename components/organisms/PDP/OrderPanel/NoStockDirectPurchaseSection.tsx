import { sendGTMEvent } from "@next/third-parties/google";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Switch from "@/components/atoms/Switch";
import SimilarWinesButton from "@/components/molecules/SimilarWinesButton";
import { useSimilarProductVariantsUrl } from "@/components/molecules/SimilarWinesButton/SimilarWinesButton";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import {
  ProductVariantJsonldShopProductVariantRead,
  ProductVariantSimilarProductVariantsDTOShopSimilarProductVariantRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  getGetDirectSaleItemDTOItemQueryKey,
  useGetDirectSaleItemDTOItem,
} from "@/networking/sylius-api-client/direct-sale-item-dt-o/direct-sale-item-dt-o";
import {
  deleteProductVariantAvailabilityAlertItem,
  usePostProductVariantAvailabilityAlertCollection,
} from "@/networking/sylius-api-client/product-variant-availability-alert/product-variant-availability-alert";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined, isNullOrUndefined } from "@/utils/ts-utils";

import styles from "./OrderPanel.module.scss";

interface Props {
  productVariant: ProductVariantJsonldShopProductVariantRead;
  similarProductVariants?: ProductVariantSimilarProductVariantsDTOShopSimilarProductVariantRead;
}

export const NoStockOrderSection = ({ productVariant }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuthenticatedUserContext();
  const { data: directSaleItem } = useGetDirectSaleItemDTOItem(productVariant.code, {
    query: { enabled: isNotNullNorUndefined(user) },
  });

  const [variantHasAlert, setVariantHasAlert] = useState<boolean>(false);

  const hasAvailabilityAlert = directSaleItem?.hasAvailabilityAlert ?? false;
  useEffect(() => {
    setVariantHasAlert(hasAvailabilityAlert);
  }, [hasAvailabilityAlert]);

  const { mutateAsync: createAlert } = usePostProductVariantAvailabilityAlertCollection();
  const queryClient = useQueryClient();

  const onChangeAlertSwitch = async () => {
    if (!variantHasAlert) {
      if (isNullOrUndefined(productVariant.id)) {
        toast.error<string>(t("common:common.errorOccurred"));

        return;
      }
      await createAlert({
        data: {
          productVariantCode: `${productVariant.code}`,
        },
      });
      sendGTMEvent({ event: "alerteDisponibilite", goalType: "alerte_disponibilite" });
    } else {
      const availabilityAlertId = directSaleItem?.availabilityAlertId;
      if (isNullOrUndefined(availabilityAlertId)) {
        toast.error<string>(t("common:common.errorOccurred"));

        return;
      }
      await deleteProductVariantAvailabilityAlertItem(`${availabilityAlertId}`);
    }
    setVariantHasAlert(!variantHasAlert);
    toast.success<string>(
      t(`acheter-vin:availabilityAlert.${variantHasAlert ? "removed" : "added"}`),
    );
    await queryClient.invalidateQueries(getGetDirectSaleItemDTOItemQueryKey(productVariant.code));
  };

  const url = useSimilarProductVariantsUrl(
    productVariant.product?.region?.name,
    productVariant.product?.appellation,
    productVariant.product?.owner,
  );

  return (
    <div className={styles.noStockActions}>
      {productVariant.restockable && (
        <div className={styles.availabilityAlert}>
          <span>{t("acheter-vin:availabilityAlert.title")}</span>
          <Switch checked={variantHasAlert} onChange={onChangeAlertSwitch} />
        </div>
      )}
      {url !== null && (
        <SimilarWinesButton
          text={t("acheter-vin:identicalWinesOnSale")}
          className={styles.addToBasketButton}
          url={url}
        />
      )}
    </div>
  );
};
