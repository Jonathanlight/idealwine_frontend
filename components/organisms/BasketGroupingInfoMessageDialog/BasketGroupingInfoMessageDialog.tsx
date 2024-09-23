import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./BasketGroupingInfoMessageDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const BasketGroupingInfoMessageDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("panier");

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <div className={styles.bankTranferModal}>{t("basketGroupingInfoModalMessage")}</div>
    </Modal>
  );
};

export default BasketGroupingInfoMessageDialog;
