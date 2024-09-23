import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./IncompatibleOrderCountriesModal.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const IncompatibleOrderCountriesModal = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("panier");

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>
        {t("incompatibleOrderCountriesModal.title")}
      </Dialog.Title>
      <div className={styles.contentContainer}>
        <p>{t("incompatibleOrderCountriesModal.content")}</p>
      </div>
    </Modal>
  );
};

export default IncompatibleOrderCountriesModal;
