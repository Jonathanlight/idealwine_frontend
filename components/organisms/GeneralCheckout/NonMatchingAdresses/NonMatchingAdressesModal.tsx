import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./NonMatchingAdressesModal.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NonMatchingAdressesModal = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("livraison");

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>{t("nonMatchingAdressesModal.title")}</Dialog.Title>
      <div className={styles.contentContainer}>
        <p>{t("nonMatchingAdressesModal.content")}</p>
      </div>
    </Modal>
  );
};

export default NonMatchingAdressesModal;
