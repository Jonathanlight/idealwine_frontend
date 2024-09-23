import { faTriangleExclamation } from "@fortawesome/pro-light-svg-icons/faTriangleExclamation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import Trans from "next-translate/Trans";

import Button from "@/components/atoms/Button/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import RedirectToPreviousPLPButton from "../../GeneralLayout/RedirectToPreviousPLPButton";
import styles from "./ShoppingCartConfirmationDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  wineName: string;
  realNumberOfLotsSelected: number;
  shouldDisplayLimitedQuantityWarning: boolean;
};

const ShoppingCartConfirmationDialog = ({
  open,
  setOpen,
  wineName,
  realNumberOfLotsSelected,
  shouldDisplayLimitedQuantityWarning,
}: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  const handleContinueShoppingClick = () => {
    setOpen(false);
  };

  const handleSeeBasketClick = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={handleContinueShoppingClick}>
      <Dialog.Title className={styles.title}>{t("confirmation_cart_dialog.title")}</Dialog.Title>
      <div className={styles.container}>
        {shouldDisplayLimitedQuantityWarning && (
          <div className={styles.limitedQuantityWarning}>
            <FontAwesomeIcon icon={faTriangleExclamation} className={styles.warningIcon} />
            {t("confirmation_cart_dialog.limitedQuantityWarning", {
              count: realNumberOfLotsSelected,
            })}
          </div>
        )}
        <p>
          <Trans
            ns="acheter-vin"
            i18nKey="confirmation_cart_dialog.description"
            // eslint-disable-next-line react/jsx-key
            components={[<strong />]}
            values={{ count: realNumberOfLotsSelected, wineName }}
          />
        </p>
        <p>
          {t("confirmation_cart_dialog.seeBasket")}{" "}
          <TranslatableLink
            href="BASKET_URL"
            className={styles.linkAccount}
            onClick={() => setOpen(!open)}
          >
            {t("confirmation_cart_dialog.yourAccount")}
          </TranslatableLink>
        </p>
        <p className={styles.note}>{t("confirmation_cart_dialog.note")}</p>
        <div className={styles.buttonContainer}>
          <RedirectToPreviousPLPButton>
            {t("confirmation_cart_dialog.button1")}
          </RedirectToPreviousPLPButton>
          <TranslatableLink href="BASKET_URL" className={styles.linkButton}>
            <Button variant="primaryBlack" className={styles.button} onClick={handleSeeBasketClick}>
              {t("confirmation_cart_dialog.button2")}
            </Button>
          </TranslatableLink>
        </div>
      </div>
    </Modal>
  );
};

export default ShoppingCartConfirmationDialog;
