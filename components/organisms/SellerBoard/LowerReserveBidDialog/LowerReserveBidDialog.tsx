import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";
import { isNullOrUndefined } from "@/utils/ts-utils";

import LowerReserveBidForm from "../LowerReserveBidForm";
import styles from "./LowerReserveBidDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialReserveBid?: number;
  productVariantCode: string;
};

const LowerReserveBidDialog = ({
  open,
  setOpen,
  initialReserveBid,
  productVariantCode,
}: Props): JSX.Element => {
  const { t } = useTranslation("section-vendeur");

  return (
    <>
      {open && (
        <Modal
          open={open}
          onOpenChange={setOpen}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Dialog.Title className={styles.title}>{t("lowerReserveBidDialog.title")}</Dialog.Title>
          {isNullOrUndefined(initialReserveBid) ? (
            <Dialog.Description className={styles.description}>
              {t("lowerReserveBidDialog.reserveBidNotSet")}
            </Dialog.Description>
          ) : (
            <LowerReserveBidForm
              setOpen={setOpen}
              productVariantCode={productVariantCode}
              initialReserveBid={initialReserveBid}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default LowerReserveBidDialog;
