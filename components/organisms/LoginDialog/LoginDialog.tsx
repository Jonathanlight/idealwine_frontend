import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./LoginDialog.module.scss";
import LoginForm from "./LoginForm";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const LoginDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <Dialog.Title className={styles.dialogTitle}>{t("login.pleaseLogin")}</Dialog.Title>
      <LoginForm onSuccessSubmit={() => setOpen(false)} setLoginModalOpen={setOpen} />
    </Modal>
  );
};

export default LoginDialog;
