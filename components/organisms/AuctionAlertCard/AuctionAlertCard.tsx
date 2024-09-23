import { faClose } from "@fortawesome/pro-light-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDebouncedEffect } from "@react-hookz/web";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import CustomColorCircleIcon from "@/components/atoms/CustomColorCircleIcon";
import Input from "@/components/atoms/Input";
import Switch from "@/components/atoms/Switch";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import Price from "@/components/molecules/Price";
import { AuctionAlertJsonldShopAuctionAlertRead } from "@/networking/sylius-api-client/.ts.schemas";
import {
  getGetAuctionAlertCollectionQueryKey,
  useDeleteAuctionAlertItem,
  usePutAuctionAlertItem,
} from "@/networking/sylius-api-client/auction-alert/auction-alert";
import { isAlertBeforeAuctionEndDate } from "@/utils/isAlertBeforeAuctionEndDate";
import { useTranslation } from "@/utils/next-utils";
import { getProductVariantAlertImagePath } from "@/utils/productVariantImage";
import { isNotNullNorUndefined, isNullOrUndefined } from "@/utils/ts-utils";

import styles from "./AuctionAlertCard.module.scss";

const IMAGE_WIDTH = 100;

type AuctionAlertCardProps = {
  auctionAlert: AuctionAlertJsonldShopAuctionAlertRead;
};
export const AuctionAlertCard = ({ auctionAlert }: AuctionAlertCardProps) => {
  const productVariant = auctionAlert.productVariantInAuctionCatalog?.productVariant;
  const auctionCatalog = auctionAlert.productVariantInAuctionCatalog?.auctionCatalog;

  const queryClient = useQueryClient();
  const { t, lang } = useTranslation();

  const firstAlertMinutes = (auctionAlert.firstAlertSecondsBeforeEnd ?? 0) / 60;
  const secondAlertHoursMounted = (auctionAlert.secondAlertSecondsBeforeEnd ?? 0) / 3600;
  const [secondAlertHours, setSecondAlertHours] = useState(secondAlertHoursMounted);

  const { mutateAsync: deleteAlert } = useDeleteAuctionAlertItem();
  const { mutateAsync: putAlert } = usePutAuctionAlertItem();

  const longEndDate =
    isNotNullNorUndefined(auctionCatalog) && isNotNullNorUndefined(auctionCatalog.endDate)
      ? new Date(auctionCatalog.endDate).toLocaleString("fr", {
          dateStyle: "short",
          timeStyle: "short",
          timeZone: "Europe/Paris",
        })
      : "-";

  const onDelete = async () => {
    if (isNullOrUndefined(auctionAlert) || isNullOrUndefined(auctionAlert.id)) {
      return;
    }
    try {
      await deleteAlert({ id: `${auctionAlert.id}` });

      toast.success<string>(t("alerts:deleted"));

      await queryClient.invalidateQueries(getGetAuctionAlertCollectionQueryKey());
    } catch (error) {
      toast.error<string>(t("common:common.errorOccurred"));
    }
  };

  const onChangeUpdateAlert = useCallback(
    async (data: {
      firstAlertSecondsBeforeEnd?: number;
      secondAlertSecondsBeforeEnd?: number;
      isFirstAlertEnabled?: boolean;
      isSecondAlertEnabled?: boolean;
    }) => {
      if (isNullOrUndefined(auctionAlert) || isNullOrUndefined(auctionAlert.id)) {
        return;
      }
      try {
        await putAlert({
          id: `${auctionAlert.id}`,
          data,
        });

        toast.success<string>(t("alerts:updated"));

        await queryClient.invalidateQueries(getGetAuctionAlertCollectionQueryKey());
      } catch (error) {
        toast.error<string>(t("common:common.errorOccurred"));
      }
    },
    [auctionAlert, putAlert, queryClient, t],
  );

  const onChangeFirstSwitch = async (newTime: number) => {
    try {
      if (!isAlertBeforeAuctionEndDate(newTime, auctionCatalog?.endDate)) throw new Error();
      await onChangeUpdateAlert({
        isFirstAlertEnabled: !auctionAlert.isFirstAlertEnabled,
      });
    } catch (error) {
      toast.error<string>(t("alerts:alertMustBeAfterAuctionEndDate"));
    }
  };

  const onChangeSecondSwitch = async (newTime: number) => {
    try {
      if (!isAlertBeforeAuctionEndDate(newTime, auctionCatalog?.endDate)) throw new Error();
      await onChangeUpdateAlert({
        isSecondAlertEnabled: !auctionAlert.isSecondAlertEnabled,
      });
    } catch (error) {
      toast.error<string>(t("alerts:alertMustBeAfterAuctionEndDate"));
    }
  };

  const onChangeSecondAlertHours = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecondAlertHours(Number(event.target.value));
  };

  // triggered when the secondAlert hours debounced value changes
  useDebouncedEffect(
    () => {
      const secondAlertHoursAdjusted = Math.min(Math.max(secondAlertHours, 2), 24);

      if (secondAlertHours !== secondAlertHoursAdjusted) {
        setSecondAlertHours(secondAlertHoursAdjusted);

        return;
      }

      if (secondAlertHours !== secondAlertHoursMounted) {
        void onChangeUpdateAlert({
          secondAlertSecondsBeforeEnd: secondAlertHours * 3600,
        });
      }
    },
    [secondAlertHours, secondAlertHoursMounted, onChangeUpdateAlert],
    500,
  );

  return (
    <div className={styles.card}>
      <div className={styles.variantContainer}>
        <TranslatableLink href={`/buy-a-wine/${productVariant?.code ?? "404"}`} dontTranslate>
          {productVariant !== undefined && (
            <Image
              unoptimized
              src={getProductVariantAlertImagePath(lang, productVariant.firstImage)}
              alt="bottle of wine"
              width={IMAGE_WIDTH}
              height={IMAGE_WIDTH * 1.334}
              className={styles.image}
            />
          )}
        </TranslatableLink>
        <div>
          <div>
            <CustomColorCircleIcon colorVariant={productVariant?.product?.color} />
            <span className={styles.wineName}>{productVariant?.name}</span>
          </div>
          <div>
            {t("alerts:vintage")} {productVariant?.productVintage?.year} | {t("alerts:estimation")}{" "}
            {isNotNullNorUndefined(productVariant) &&
              isNotNullNorUndefined(productVariant.averageEstimate) && (
                <>
                  <Price size="small" price={productVariant.averageEstimate} /> {" |"}
                </>
              )}
            {t("alerts:currentOrder")}{" "}
            {isNotNullNorUndefined(auctionAlert.productVariantInAuctionCatalog) &&
            isNotNullNorUndefined(auctionAlert.productVariantInAuctionCatalog.readModel) &&
            isNotNullNorUndefined(
              auctionAlert.productVariantInAuctionCatalog.readModel.highestBid,
            ) ? (
              <Price
                size="small"
                price={auctionAlert.productVariantInAuctionCatalog.readModel.highestBid}
              />
            ) : (
              "-"
            )}
            | {t("alerts:endOfAuction")} {longEndDate}
            {/* TODO getting current order from auction orders without triggering N+1 queries */}
          </div>
        </div>
      </div>

      <div className={styles.alertOptionsContainer}>
        <div className={styles.alertOptionsSwitchesColumnContainer}>
          <div className={styles.grey}>
            <Switch
              checked={auctionAlert.isFirstAlertEnabled ?? false}
              onChange={() => onChangeFirstSwitch(auctionAlert.firstAlertSecondsBeforeEnd ?? 0)}
            />
            {t("alerts:putAnAlert")} {firstAlertMinutes} {t("alerts:minutesAbbrev")}{" "}
            {t("alerts:beforeAuctionEnd")}
          </div>
          <div className={styles.grey}>
            <Switch
              checked={auctionAlert.isSecondAlertEnabled ?? false}
              onChange={() => onChangeSecondSwitch(auctionAlert.secondAlertSecondsBeforeEnd ?? 0)}
            />
            <span className={styles.simpleRow}>
              {t("alerts:putAnAlert")}
              <Input
                className={styles.input}
                type="number"
                min={2}
                max={24}
                value={secondAlertHours}
                onChange={onChangeSecondAlertHours}
              />
              {t("alerts:hoursAbbrev")} {t("alerts:beforeAuctionEnd")}
            </span>
          </div>
        </div>
        <div className={styles.grey}>
          <button className={styles.button} onClick={onDelete}>
            <FontAwesomeIcon icon={faClose} size="lg" />
          </button>
        </div>
      </div>
    </div>
  );
};
