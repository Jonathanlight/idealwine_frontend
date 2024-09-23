import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import RedirectToPreviousPLPButton from "../../GeneralLayout/RedirectToPreviousPLPButton";
import styles from "./AuctionConfirmationDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isThreshold?: boolean;
};

const AuctionConfirmationDialog = ({ open, setOpen, isThreshold = false }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  const auctionType = isThreshold ? "threshold" : "bid";

  const handleContinueShoppingClick = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={handleContinueShoppingClick}>
      <Dialog.Title className={styles.title}>
        {t(`auction_confirmation_dialog.${auctionType}.title`)}
      </Dialog.Title>
      <div className={styles.container}>
        <p className={styles.confirmation}>
          {t(`auction_confirmation_dialog.${auctionType}.confirmation`)}
        </p>
        <p className={styles.description}>
          {t(`auction_confirmation_dialog.${auctionType}.description`)}
        </p>
        <div className={styles.buttonContainer}>
          <RedirectToPreviousPLPButton>{t(`returnToAuctions`)}</RedirectToPreviousPLPButton>
        </div>
      </div>
    </Modal>
  );
};

export default AuctionConfirmationDialog;
