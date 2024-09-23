import * as Dialog from "@radix-ui/react-dialog";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "../ExceptionDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const OverdueUnpaidOrdersExceptionDialog = ({ open, setOpen }: Props): JSX.Element => {
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
        {t("overdue_unpaid_orders_exception_dialog.title")}
      </Dialog.Title>
      <div className={styles.dialogContainer}>
        <span className={styles.description}>
          {t("overdue_unpaid_orders_exception_dialog.description")}{" "}
          <TranslatableLink href="GENERAL_CONDITIONS_URL" className={styles.link}>
            {t("overdue_unpaid_orders_exception_dialog.click_here")}
          </TranslatableLink>
        </span>
      </div>
    </Modal>
  );
};

export default OverdueUnpaidOrdersExceptionDialog;
