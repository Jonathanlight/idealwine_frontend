import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./StorageCellarContactDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const StorageCellarDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { lang } = useTranslation();

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => setOpen(false)}
      className={styles.modal}
    >
      <iframe
        className={styles.iframe}
        title="cellar-wine-contact"
        src={`https://www.idealwine.biz/Cave_Stockage/form.php?lang=${lang}&form=1`}
        frameBorder="0"
        scrolling="auto"
        width="100%"
      ></iframe>
    </Modal>
  );
};

export default StorageCellarDialog;
