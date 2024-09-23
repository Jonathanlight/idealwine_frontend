import { faClose } from "@fortawesome/pro-light-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import CustomColorCircleIcon from "@/components/atoms/CustomColorCircleIcon";
import { ProductAvailabilityAlertJsonldShopProductAvailabilityAlertRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useDeleteProductAvailabilityAlertItem } from "@/networking/sylius-api-client/product-availability-alert/product-availability-alert";
import { getAvailabilityAlertImagePath } from "@/utils/availabilityAlertImage";
import { useTranslation } from "@/utils/next-utils";
import { isNullOrUndefined } from "@/utils/ts-utils";

import styles from "./AvailabilityAlertCard.module.scss";
const IMAGE_WIDTH = 80;

type AvailabilityAlertCardProps = {
  availabilityAlert: ProductAvailabilityAlertJsonldShopProductAvailabilityAlertRead;
  onDeleteSuccess: () => void;
};
export const AvailabilityAlertCard = ({
  availabilityAlert,
  onDeleteSuccess,
}: AvailabilityAlertCardProps) => {
  const { t, lang } = useTranslation();

  const { mutateAsync: deleteAlert, isLoading } = useDeleteProductAvailabilityAlertItem();

  const onDelete = async () => {
    if (isNullOrUndefined(availabilityAlert) || isNullOrUndefined(availabilityAlert.id)) {
      return;
    }
    try {
      await deleteAlert({ id: `${availabilityAlert.id}` });

      toast.success<string>(t("alerts:deleted"));

      onDeleteSuccess();
    } catch (error) {
      toast.error<string>(t("common:common.errorOccurred"));
    }
  };

  const availabilityAlertImagePath =
    getAvailabilityAlertImagePath(availabilityAlert) ?? `/_no_picture_${lang}.jpg`;

  return (
    <div className={styles.card}>
      <div className={styles.variantContainer}>
        <div className={styles.photoContainer}>
          <Image
            unoptimized
            src={availabilityAlertImagePath}
            alt="bottle of wine"
            width={IMAGE_WIDTH}
            height={IMAGE_WIDTH}
          />
        </div>
        <div className={styles.infoContainer}>
          <div>
            <CustomColorCircleIcon
              colorVariant={availabilityAlert.productVintage?.product?.color}
            />
            <span>
              <strong className={styles.wineName}>
                {availabilityAlert.productVintage?.product?.name}
              </strong>
              {availabilityAlert.productVintage?.product?.appellation}{" "}
              {availabilityAlert.productVintage?.year}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.grey}>
        <Button
          className={styles.button}
          variant="primaryBlack"
          onClick={onDelete}
          isLoading={isLoading}
        >
          <FontAwesomeIcon icon={faClose} size="lg" />
        </Button>
      </div>
    </div>
  );
};
