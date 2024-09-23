import { useState } from "react";

import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import { useTranslation } from "@/utils/next-utils";

import styles from "./StockDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  quantity: number;
  handleRequest: (wantedQuantity: number) => Promise<void>;
};

const StockDialog = ({ open, setOpen, quantity, handleRequest }: Props): JSX.Element => {
  const { t } = useTranslation("lots-en-stock");

  const [wantedQuantity, setWantedQuantity] = useState(1);

  const options = [
    ...Array.from({ length: quantity }).map((_, index) => ({
      value: (index + 1).toString(),
      label: (index + 1).toString(),
    })),
  ];

  const handleQuantitySelection = (value: string) => {
    setWantedQuantity(parseInt(value));
  };

  return (
    <Modal open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
      <div className={styles.stockDialogModal}>
        <h3>{t("selectQuantity")}</h3>
        <Select
          className={styles.select}
          value={wantedQuantity.toString()}
          options={{
            groups: [
              {
                key: "stock_quantity",
                options,
              },
            ],
          }}
          onValueChange={handleQuantitySelection}
        />
        <div className={styles.buttons}>
          <Button
            className={styles.cancelButton}
            onClick={() => {
              setOpen(false);
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={async () => {
              setOpen(false);
              await handleRequest(wantedQuantity);
            }}
          >
            {t("validate")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StockDialog;
