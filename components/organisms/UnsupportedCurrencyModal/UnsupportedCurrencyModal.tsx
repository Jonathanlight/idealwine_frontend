import * as Dialog from "@radix-ui/react-dialog";
import Trans from "next-translate/Trans";

import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import Price from "@/components/molecules/Price";
import { useTranslation } from "@/utils/next-utils";

import styles from "./UnsupportedCurrencyModal.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onContinue: () => void;
  currency: string;
  amountInEur: number;
};

const UnsupportedCurrencyModal = ({
  open,
  setOpen,
  onContinue,
  currency,
  amountInEur,
}: Props): JSX.Element => {
  const { t } = useTranslation("paiement");

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <Dialog.Title className={styles.title}>{t("unsupportedCurrencyModal.title")}</Dialog.Title>
      <div className={styles.contentContainer}>
        <p>{t("unsupportedCurrencyModal.content", { currency })}</p>
        <b>
          <Trans
            ns="paiement"
            i18nKey={"unsupportedCurrencyModal.amountInEur"}
            values={{ currency }}
            components={[<Price key={0} doNotConvertPrice size="small" price={amountInEur} />]}
          />
        </b>
      </div>
      <div className={styles.buttonsContainer}>
        <Button variant="secondaryWhite" onClick={() => setOpen(false)}>
          {t("unsupportedCurrencyModal.cancel")}
        </Button>
        <Button variant="primaryBlack" onClick={() => onContinue()}>
          {t("unsupportedCurrencyModal.continue")}
        </Button>
      </div>
    </Modal>
  );
};

export default UnsupportedCurrencyModal;
