import Trans from "next-translate/Trans";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./AuctionAlertTriggeredDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const BankTranferRequestDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <div className={styles.alertTriggeredModal}>
        <h1>{t("alert.title")}</h1>
        <p>
          <Trans
            ns="acheter-vin"
            i18nKey="alert.content"
            components={[<TranslatableLink key={0} href="WATCHLIST_URL" className={styles.link} />]}
          />
        </p>
      </div>
    </Modal>
  );
};

export default BankTranferRequestDialog;
