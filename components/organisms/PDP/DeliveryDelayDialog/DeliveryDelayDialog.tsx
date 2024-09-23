import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./DeliveryDelayDialog.module.scss";
type Props = {
  open: boolean;
  dateMin: string;
  dateMax: string;
  dateExpressMin: string;
  dateExpressMax: string;
  setOpen: (open: boolean) => void;
  onClose?: () => void;
};

const DeliveryDelayDialog = ({
  open,
  dateMin,
  dateMax,
  dateExpressMin,
  dateExpressMax,
  setOpen,
  onClose,
}: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        onClose?.();
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>{t("deliveryDelayDialog.title")}</Dialog.Title>
      <Dialog.Content className={styles.content}>
        {t("deliveryDelayDialog.content", {
          dateMin: dateMin,
          dateMax: dateMax,
          dateExpressMin: dateExpressMin,
          dateExpressMax: dateExpressMax,
        })}
      </Dialog.Content>
    </Modal>
  );
};

export default DeliveryDelayDialog;
