import * as Dialog from "@radix-ui/react-dialog";

import Button from "@/components/atoms/Button/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./CompletePersonalInfoDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const FROM_BASKET_QUERY_PARAM = "from_basket";

const CompletePersonalInfoDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>
        {t("checkout-common:complete_personal_info_dialog.title")}
      </Dialog.Title>
      <div className={styles.container}>
        <div className={styles.content}>
          <p>{t("checkout-common:complete_personal_info_dialog.content")}</p>
        </div>
        <div className={styles.buttonContainer}>
          <TranslatableLink
            className={styles.link}
            href="MY_IDEALWINE_HOME_URL"
            queryParam={new URLSearchParams({ [FROM_BASKET_QUERY_PARAM]: "true" })}
          >
            <Button variant="primaryBlack" className={styles.button}>
              {t("checkout-common:complete_personal_info_dialog.button")}
            </Button>
          </TranslatableLink>
        </div>
      </div>
    </Modal>
  );
};

export default CompletePersonalInfoDialog;
