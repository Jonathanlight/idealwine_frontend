import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./SignupMailValidationDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SignupMailValidationDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <Dialog.Title className={styles.dialogTitle}>{t("login.confirmYourAccount")}</Dialog.Title>
      <Dialog.Content className={styles.dialogContent}>
        {t("login.signupMailValidation")}
      </Dialog.Content>
    </Modal>
  );
};

export default SignupMailValidationDialog;
