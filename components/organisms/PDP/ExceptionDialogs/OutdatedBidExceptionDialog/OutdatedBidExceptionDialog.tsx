import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "../ExceptionDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const OutdatedBidExceptionDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>
        {t("outdated_bid_exception_dialog.title")}
      </Dialog.Title>
      <div className={styles.dialogContainer}>
        <span className={styles.description}>{t("outdated_bid_exception_dialog.description")}</span>
      </div>
    </Modal>
  );
};

export default OutdatedBidExceptionDialog;
