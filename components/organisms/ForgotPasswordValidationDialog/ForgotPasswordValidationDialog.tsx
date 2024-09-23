import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "../ForgotPasswordDialog/ForgotPasswordDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose?: () => void;
};

const ForgotPasswordValidationDialog = ({ open, setOpen, onClose }: Props): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        onClose?.();
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.dialogTitle}>
        {t("login.forgotPasswordLinkSent")}
      </Dialog.Title>
      <Dialog.Content>{t("login.forgotPasswordLinkSentDescription")}</Dialog.Content>
    </Modal>
  );
};

export default ForgotPasswordValidationDialog;
