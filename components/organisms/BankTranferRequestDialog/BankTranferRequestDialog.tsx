import Trans from "next-translate/Trans";

import Button from "@/components/atoms/Button/Button";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./BankTranferRequestDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClickConfirm: () => void;
};

const BankTranferRequestDialog = ({ open, setOpen, onClickConfirm }: Props): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <div className={styles.bankTranferModal}>
        <h1>{t("accueil-profil:bankTransferModalTitle")}</h1>
        <p>{t("accueil-profil:bankTransferModalWarning")}</p>
        <p className={styles.bankTranferModalContent}>
          {t("accueil-profil:bankTransferModalDescription")}
        </p>
        <Button variant="primaryBlack" onClick={onClickConfirm}>
          {t("accueil-profil:bankTransferModalButton")}
        </Button>
        <p className={styles.bankTransferModalDescriptionBelowButton}>
          <Trans
            ns="accueil-profil"
            i18nKey="bankTransferModalDescriptionBelowButton"
            // eslint-disable-next-line jsx-a11y/anchor-has-content
            components={[<a key={0} href="mailto:info@idealwine.com" />]}
            values={{ mailto: "info@idealwine.com" }}
          />
        </p>
      </div>
    </Modal>
  );
};

export default BankTranferRequestDialog;
