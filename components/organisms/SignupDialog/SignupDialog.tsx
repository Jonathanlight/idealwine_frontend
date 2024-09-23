import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "../LoginDialog/LoginDialog.module.scss";
import SignupForm from "./SignupForm";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsSignupMailValidationModalOpen: (open: boolean) => void;
};

const SignupDialog = ({
  open,
  setOpen,
  setIsSignupMailValidationModalOpen,
}: Props): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <Dialog.Title className={styles.dialogTitle}>{t("login.signUp")}</Dialog.Title>
      <SignupForm
        onSuccessSubmit={() => {
          setOpen(false);
          setIsSignupMailValidationModalOpen(true);
        }}
      />
    </Modal>
  );
};

export default SignupDialog;
