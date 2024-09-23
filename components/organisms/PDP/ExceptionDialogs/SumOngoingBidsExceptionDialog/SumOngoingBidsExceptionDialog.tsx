import * as Dialog from "@radix-ui/react-dialog";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "../ExceptionDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SumOngoingBidsExceptionDialog = ({ open, setOpen }: Props): JSX.Element => {
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
        {t("sum_ongoing_bids_exception_dialog.title")}
      </Dialog.Title>
      <div className={styles.dialogContainer}>
        <span className={styles.description}>
          {t("sum_ongoing_bids_exception_dialog.description")}
          <TranslatableLink href="CONTACT_URL">
            {t("sum_ongoing_bids_exception_dialog.contentLink")}
          </TranslatableLink>
        </span>
      </div>
    </Modal>
  );
};

export default SumOngoingBidsExceptionDialog;
