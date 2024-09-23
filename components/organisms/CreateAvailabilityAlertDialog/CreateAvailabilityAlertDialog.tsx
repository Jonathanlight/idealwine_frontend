import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import Modal from "@/components/molecules/Modal";
import { usePostProductAvailabilityAlertCollection } from "@/networking/sylius-api-client/product-availability-alert/product-availability-alert";
import { useTranslation } from "@/utils/next-utils";

import styles from "./CreateAvailabilityAlertDialog.module.scss";

type VintageMinMax = {
  vintageMin: string;
  vintageMax: string;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  productId: string;
  vintageYear?: string;
};

const CreateAvailabilityAlertDialog = ({
  open,
  setOpen,
  productId,
  vintageYear,
}: Props): JSX.Element => {
  const { t } = useTranslation("alerts");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VintageMinMax>({
    defaultValues: {
      vintageMin: vintageYear,
      vintageMax: vintageYear,
    },
  });
  const { mutateAsync: createAlert, isLoading } = usePostProductAvailabilityAlertCollection();

  const onSubmit: SubmitHandler<VintageMinMax> = async data => {
    if (data.vintageMin > data.vintageMax) {
      setError("vintageMin", {
        type: "manual",
        message: t("add-alert.vintage-from-must-be-lower"),
      });

      return;
    }

    try {
      await createAlert({
        data: {
          productID: productId,
          vintageMin: data.vintageMin,
          vintageMax: data.vintageMax,
        },
      });

      setOpen(false);

      toast.success<string>(
        <div>
          {t("add-alert.success")} <br />
          <TranslatableLink className={styles.successLink} href="MY_ALERTS_URL">
            {t("add-alert.success-link")}
          </TranslatableLink>
        </div>,
      );
    } catch (err) {
      toast.error<string>(t("add-alert.error"));
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <form className={styles.alertTriggeredModal} onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>{t("add-alert.title")}</h1>
        <div className={styles.twoInputs}>
          <Input
            type="number"
            min="1900"
            max="2099"
            defaultValue="2016"
            label={t("add-alert.vintage-from")}
            error={errors.vintageMin?.message}
            {...register("vintageMin")}
          />

          <Input
            type="number"
            min="1900"
            max="2099"
            defaultValue="2016"
            label={t("add-alert.vintage-to")}
            {...register("vintageMax")}
          />
        </div>

        <Button isLoading={isLoading}>{t("add-alert.create-button")}</Button>
      </form>
    </Modal>
  );
};

export default CreateAvailabilityAlertDialog;
