import { faBell } from "@fortawesome/pro-light-svg-icons/faBell";
import { faHeart } from "@fortawesome/pro-light-svg-icons/faHeart";
import { faBell as faBellSolid } from "@fortawesome/pro-solid-svg-icons/faBell";
import { faHeart as faHeartSolid } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { toast } from "react-toastify";

import TooltipCustom from "@/components/molecules/Tooltip/Tooltip";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { AuctionAlertJsonld } from "@/networking/sylius-api-client/.ts.schemas";
import {
  deleteAuctionAlertItem,
  getGetAuctionAlertCollectionQueryKey,
  usePostAuctionAlertCollection,
} from "@/networking/sylius-api-client/auction-alert/auction-alert";
import { getGetAuctionItemDTOItemQueryKey } from "@/networking/sylius-api-client/auction-item-dt-o/auction-item-dt-o";
import {
  getShopGetWishlistCustomerItemQueryKey,
  useShopPutWishlistCustomerItem,
} from "@/networking/sylius-api-client/customer/customer";
import { ImageFilters } from "@/utils/imageFilters";
import { getCustomerIRI, getProductVariantIRI } from "@/utils/iriUtils";
import { isAlertBeforeAuctionEndDate } from "@/utils/isAlertBeforeAuctionEndDate";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined, isNullOrUndefined } from "@/utils/ts-utils";

import styles from "./HeartButton.module.scss";

const MIN_SHOWN_FOLLOWERS_COUNT = 1;
const MAX_SHOWN_FOLLOWERS_COUNT = 99;

type HeartButtonProps = {
  code: string;
  isDirectPurchase: boolean;
  productVariantInAuctionCatalogId?: string;
  followersCount?: number;
  onToggleToOnSuccess?: () => void;
  endDateISOString?: string;
};

const FIRST_ALERT_MINUTES_BEFORE_END = 45;
const SECOND_ALERT_HOURS_BEFORE_END = 4;

const HeartButton = ({
  code,
  isDirectPurchase,
  productVariantInAuctionCatalogId,
  followersCount,
  onToggleToOnSuccess,
  endDateISOString,
}: HeartButtonProps) => {
  const { t } = useTranslation();

  const { user, wishlist, auctionAlerts, setIsLoginModalOpen } = useAuthenticatedUserContext();
  const queryClient = useQueryClient();

  const isInWishlist = wishlist.has(code);
  const isInAuctionAlerts = auctionAlerts.has(code);

  const { mutateAsync: putWishlist } = useShopPutWishlistCustomerItem();
  const { mutateAsync: createAlert } = usePostAuctionAlertCollection();

  const toggleWishlist = async () => {
    if (isNullOrUndefined(user)) {
      setIsLoginModalOpen(true);

      return;
    }

    const currentWishlist = Array.from(wishlist, ([pdCode]) => getProductVariantIRI(pdCode));

    try {
      if (isDirectPurchase) {
        let desiredWishlist: string[] = [];
        if (isInWishlist) {
          desiredWishlist = currentWishlist.filter(itemIRI => !itemIRI.includes(code));
        } else {
          desiredWishlist = [...currentWishlist, getProductVariantIRI(code)];
        }

        const response = await putWishlist({
          id: user.customerId,
          data: { favoriteProducts: desiredWishlist },
        });
        queryClient.setQueryData(getShopGetWishlistCustomerItemQueryKey(user.customerId), response);
      } else {
        if (isInAuctionAlerts) {
          const id = auctionAlerts.get(code)?.id;
          if (isNullOrUndefined(id)) {
            toast.error<string>(t("common:common.errorOccurred"));

            return;
          }
          await deleteAuctionAlertItem(`${id}`);

          await queryClient.invalidateQueries(getGetAuctionAlertCollectionQueryKey());

          await queryClient.invalidateQueries(getGetAuctionItemDTOItemQueryKey(code));

          toast.success<string>(t("common:alertDeleted"));

          return;
        }

        const newAlert: AuctionAlertJsonld = {
          firstAlertSecondsBeforeEnd: FIRST_ALERT_MINUTES_BEFORE_END * 60,
          isFirstAlertEnabled: isAlertBeforeAuctionEndDate(
            FIRST_ALERT_MINUTES_BEFORE_END * 60,
            endDateISOString,
          ),
          secondAlertSecondsBeforeEnd: SECOND_ALERT_HOURS_BEFORE_END * 3600,
          isSecondAlertEnabled: isAlertBeforeAuctionEndDate(
            SECOND_ALERT_HOURS_BEFORE_END * 3600,
            endDateISOString,
          ),
          customer: getCustomerIRI(user.customerId),
          productVariantInAuctionCatalog: productVariantInAuctionCatalogId,
        };
        const response = await createAlert({ data: newAlert });
        sendGTMEvent({ event: "surveillerVin", goalType: "surveiller_vin" });

        queryClient.setQueryData(
          getGetAuctionAlertCollectionQueryKey({ filter: [ImageFilters.ALERT] }),
          { "hydra:member": [...Array.from(auctionAlerts, ([, variant]) => variant), response] },
        );

        if (onToggleToOnSuccess === undefined) {
          toast.success<string>(t("common:alertAdded"));
        } else {
          onToggleToOnSuccess();
        }

        await queryClient.invalidateQueries(getGetAuctionItemDTOItemQueryKey(code));
      }
    } catch (error) {
      queryClient.setQueryData(
        getGetAuctionAlertCollectionQueryKey({ filter: [ImageFilters.ALERT] }),
        { "hydra:member": Array.from(auctionAlerts, ([, variant]) => variant) },
      );
      toast.error<string>(t("common:common.errorOccurred"));
    }
  };

  if (
    !isDirectPurchase &&
    isNotNullNorUndefined(endDateISOString) &&
    endDateISOString < new Date().toISOString()
  ) {
    return null;
  }

  return (
    <TooltipCustom
      trigger={
        <div className={styles.container}>
          <FontAwesomeIcon
            onClick={() => toggleWishlist()}
            icon={
              isDirectPurchase
                ? isInWishlist
                  ? faHeartSolid
                  : faHeart
                : isInAuctionAlerts
                ? faBellSolid
                : faBell
            }
            className={styles.headerSellingIcon}
            size="lg"
          />

          {followersCount !== undefined && followersCount >= MIN_SHOWN_FOLLOWERS_COUNT && (
            <div
              className={clsx(
                styles.followersCount,
                followersCount > 9 && styles.twoDigitsFollowerCount,
              )}
            >
              {followersCount < MAX_SHOWN_FOLLOWERS_COUNT
                ? followersCount
                : `${MAX_SHOWN_FOLLOWERS_COUNT}+`}
            </div>
          )}
        </div>
      }
      contentProps={{ side: "left" }}
    >
      {followersCount !== undefined && (
        <span>
          {isDirectPurchase
            ? t(`common:notifications.favorites.${isInWishlist ? "remove" : "add"}`)
            : t(
                `common:notifications.followers.${followersCount >= 2 ? "other" : followersCount}`,
                { count: followersCount },
              )}
        </span>
      )}
    </TooltipCustom>
  );
};

export default HeartButton;
