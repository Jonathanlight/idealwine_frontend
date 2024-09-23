import * as Dialog from "@radix-ui/react-dialog";

import LinkButton from "@/components/atoms/Button/LinkButton";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "../ExceptionDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const MissingDefaultAddressDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={handleClick}>
      <Dialog.Title className={styles.title}>
        {t(`missing_default_address_dialog.title`)}
      </Dialog.Title>
      <div className={styles.dialogContainer}>
        <p className={styles.description}>{t(`missing_default_address_dialog.description`)}</p>
        <div className={styles.buttonContainer}>
          <LinkButton
            className={styles.button}
            href={"MY_IDEALWINE_HOME_URL"}
            onClick={handleClick}
          >
            {t("finalizeInscription")}
          </LinkButton>
        </div>
      </div>
    </Modal>
  );
};

export default MissingDefaultAddressDialog;
