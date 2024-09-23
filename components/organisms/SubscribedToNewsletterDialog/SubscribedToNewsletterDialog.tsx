import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "../ForgotPasswordDialog/ForgotPasswordDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SubscribedToNewsletterDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Dialog.Title className={styles.dialogTitle}>
        {t("footer.subscribedToNewsletterTitle")}
      </Dialog.Title>
      <Dialog.Content>{t("footer.subscribedToNewsletterDescription")}</Dialog.Content>
    </Modal>
  );
};

export default SubscribedToNewsletterDialog;
