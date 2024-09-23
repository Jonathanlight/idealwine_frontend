import { useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isNullOrUndefined } from "util";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { ProductVariantProductVariantSaleReserveBidDTO } from "@/networking/sylius-api-client/.ts.schemas";
import { getGetProductVariantProductVariantSaleDTOCollectionQueryKey } from "@/networking/sylius-api-client/product-variant-sale-dt-o/product-variant-sale-dt-o";
import { useShopPatchReserveBidProductVariantItem } from "@/networking/sylius-api-client/product-variant/product-variant";
import { centsToUnits, unitsToCents } from "@/utils/formatHandler";
import { useTranslation } from "@/utils/next-utils";

import styles from "./LowerReserveBidForm.module.scss";

type Props = {
  setOpen: (open: boolean) => void;
  productVariantCode: string;
  initialReserveBid: number;
};

const LowerReserveBidForm = ({
  setOpen,
  productVariantCode,
  initialReserveBid,
}: Props): JSX.Element => {
  const { t } = useTranslation("section-vendeur");

  const { register, handleSubmit } = useForm<ProductVariantProductVariantSaleReserveBidDTO>();

  const { mutateAsync, isLoading } = useShopPatchReserveBidProductVariantItem();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<ProductVariantProductVariantSaleReserveBidDTO> = async data => {
    try {
      if (isNullOrUndefined(data.reserveBid)) {
        throw new Error("reserveBid is null or undefined");
      }

      await mutateAsync({
        code: productVariantCode,
        data: { reserveBid: unitsToCents(data.reserveBid) },
      });
      void queryClient.invalidateQueries({
        queryKey: getGetProductVariantProductVariantSaleDTOCollectionQueryKey(),
      });

      toast.success<string>(t("lowerReserveBidDialog.success"));
      setOpen(false);
    } catch (_e) {
      toast.error<string>(t("lowerReserveBidDialog.error"));
    }
  };

  return (
    <form className={styles.reserveBidForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.reserveBidInput}>
        <Input
          type="number"
          min={1}
          max={Math.floor(centsToUnits(initialReserveBid)) - 1}
          step={1}
          defaultValue={Math.floor(centsToUnits(initialReserveBid))}
          {...register("reserveBid")}
        />
        €
      </div>
      <div className={styles.actions}>
        <Button variant="secondaryWhite" onClick={() => setOpen(false)}>
          {t("lowerReserveBidDialog.cancel")}
        </Button>
        <Button variant="primaryBlack" type="submit" isLoading={isLoading}>
          {t("lowerReserveBidDialog.submit")}
        </Button>
      </div>
    </form>
  );
};

export default LowerReserveBidForm;
