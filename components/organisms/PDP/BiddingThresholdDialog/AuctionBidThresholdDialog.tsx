import { faInfoCircle } from "@fortawesome/pro-light-svg-icons/faInfoCircle";
import { faMinus } from "@fortawesome/pro-light-svg-icons/faMinus";
import { faPlus } from "@fortawesome/pro-light-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";

import Button from "@/components/atoms/Button/Button";
import Modal from "@/components/molecules/Modal";
import Price from "@/components/molecules/Price/Price";
import { getNextStep, getPreviousStep } from "@/domain/auction/bid";
import { useFindCustomsFeeRate } from "@/hooks/useFindCustomsFeeRate";
import useResetThresholdBidWhenStale from "@/hooks/useResetThresholdBidWhenStale";
import { calculateFees } from "@/utils/FeesHandler";
import { useTranslation } from "@/utils/next-utils";

import styles from "./AuctionBidThresholdDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialNextThresholdAmount: number;
  thresholdAmount: number;
  setThresholdAmount: Dispatch<SetStateAction<number>>;
  countryCode: string;
  numberOfBottles: number;
  createAuction: () => void;
  isLoading: boolean;
  setOpenTotalAmountInformationDialog: (open: boolean) => void;
};

const AuctionBidThresholdDialog = ({
  open,
  setOpen,
  initialNextThresholdAmount,
  thresholdAmount,
  setThresholdAmount,
  countryCode,
  numberOfBottles,
  createAuction,
  isLoading,
  setOpenTotalAmountInformationDialog,
}: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  const { setIsBidding } = useResetThresholdBidWhenStale({
    thresholdBid: initialNextThresholdAmount,
    updateThresholdBid: () => setThresholdAmount(initialNextThresholdAmount),
  });

  const customsFeeRate = useFindCustomsFeeRate(countryCode);

  const { allIncludedAmount } = calculateFees(thresholdAmount, numberOfBottles, customsFeeRate);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>
        {t("acheter-vin:auction_bid_threshold_dialog.title")}
      </Dialog.Title>
      <div className={styles.content}>
        <div className={styles.bidStepsContainer}>
          <div className={styles.price}>
            <Price price={thresholdAmount} size="big" className={styles.thresholdAmount} />
          </div>
          <Button
            className={styles.increaseBidButton}
            variant="icon"
            onClick={() => {
              setThresholdAmount(_thresholdAmount => getNextStep(_thresholdAmount));
              setIsBidding(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <Button
            className={styles.decreaseBidButton}
            variant="icon"
            onClick={() => {
              setThresholdAmount(_thresholdAmount => getPreviousStep(_thresholdAmount));
              setIsBidding(true);
            }}
            disabled={thresholdAmount <= initialNextThresholdAmount}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        </div>
        <Button
          variant="primaryBlack"
          onClick={() => {
            createAuction();
          }}
          className={styles.bidButton}
          isLoading={isLoading}
        >
          {t("acheter-vin:auction_bid_threshold_dialog.confirmButton")}
        </Button>
        <Button
          className={styles.auctionTotalAmountInformationButton}
          variant="icon"
          onClick={() => {
            setOpenTotalAmountInformationDialog(true);
          }}
        >
          <Price price={allIncludedAmount} size="tiny" />
          <p>{t(`acheter-vin:auction.withCommission`)}</p>
          <FontAwesomeIcon icon={faInfoCircle} />
        </Button>
      </div>
    </Modal>
  );
};

export default AuctionBidThresholdDialog;
