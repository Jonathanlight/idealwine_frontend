import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./AuctionBidSurpassedByThresholdDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AuctionBidSurpassedByThresholdDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  const handleContinueShoppingClick = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={handleContinueShoppingClick}>
      <Dialog.Title className={styles.title}>
        {t("auction_bid_surpassed_by_threshold_dialog.title")}
      </Dialog.Title>
      <div className={styles.container}>
        <p className={styles.description}>
          {t("auction_bid_surpassed_by_threshold_dialog.description")}
        </p>
      </div>
    </Modal>
  );
};

export default AuctionBidSurpassedByThresholdDialog;
