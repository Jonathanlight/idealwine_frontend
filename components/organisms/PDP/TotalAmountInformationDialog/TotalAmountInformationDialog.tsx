import * as Dialog from "@radix-ui/react-dialog";

import Modal from "@/components/molecules/Modal";
import Price from "@/components/molecules/Price/Price";
import { useFindCustomsFeeRate } from "@/hooks/useFindCustomsFeeRate";
import { calculateFees } from "@/utils/FeesHandler";
import { isCountryCodeInUnitedKingdom } from "@/utils/countryUtils";
import { useTranslation } from "@/utils/next-utils";

import styles from "./TotalAmountInformationDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isVATrecoverable: boolean;
  potentialBidAmount: number;
  countryCode: string;
  numberOfBottles: number;
};

const TotalAmountInformationDialog = ({
  open,
  setOpen,
  isVATrecoverable,
  potentialBidAmount,
  countryCode,
  numberOfBottles,
}: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  const customsFeeRate = useFindCustomsFeeRate(countryCode);

  const { buyerFee, VATOnBuyerFee, customDutiesFee, allIncludedAmount } = calculateFees(
    potentialBidAmount,
    numberOfBottles,
    customsFeeRate,
  );

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>
        {t("total_amount_information_dialog.title")}
      </Dialog.Title>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>{t("total_amount_information_dialog.table.nextBid")}</td>
              <td>
                <Price price={potentialBidAmount} size="small" />
              </td>
            </tr>
            <tr>
              <td>{t("total_amount_information_dialog.table.buyerFee")}</td>
              <td>
                <Price price={buyerFee} size="small" />
              </td>
            </tr>
            <tr>
              <td>{t("total_amount_information_dialog.table.VATOnBuyerFee")}</td>
              <td>
                <Price price={VATOnBuyerFee} size="small" />
              </td>
            </tr>
            {isCountryCodeInUnitedKingdom(countryCode) && (
              <tr>
                <td>{t("total_amount_information_dialog.table.customDutiesFee")}</td>
                <td>
                  <Price price={customDutiesFee} size="small" />
                </td>
              </tr>
            )}
            <tr>
              <td>{t("total_amount_information_dialog.table.allIncludedAmount")}</td>
              <td>
                <Price className={styles.ttcPrice} price={allIncludedAmount} size="small" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.dialogContainer}>
        <span className={styles.description}>
          {t("total_amount_information_dialog.description")}
        </span>
        <span className={styles.description}>
          {t("total_amount_information_dialog.isVATrecoverable", {
            isVATrecoverable: isVATrecoverable
              ? `${t("enums:boolean.true")}`
              : `${t("enums:boolean.false")}`,
          })}
        </span>
      </div>
    </Modal>
  );
};

export default TotalAmountInformationDialog;
