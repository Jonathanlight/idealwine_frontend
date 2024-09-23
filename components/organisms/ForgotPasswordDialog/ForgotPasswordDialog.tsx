import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ForgotPasswordDialog.module.scss";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsPasswordForgotMailValidationModalOpen: (open: boolean) => void;
};

const ForgotPasswordDialog = ({
  open,
  setOpen,
  setIsPasswordForgotMailValidationModalOpen,
}: Props): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <Dialog.Title className={styles.dialogTitle}>{t("login.forgotPassword")}</Dialog.Title>
      <ForgotPasswordForm
        onSuccessSubmit={() => {
          setOpen(false);
          setIsPasswordForgotMailValidationModalOpen(true);
        }}
      />
    </Modal>
  );
};

export default ForgotPasswordDialog;
