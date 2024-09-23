import { faCheckCircle } from "@fortawesome/pro-light-svg-icons/faCheckCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isAxiosError } from "axios";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button/Button";
import Price from "@/components/molecules/Price";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { getNextStep } from "@/domain/auction/bid";
import useAuctionBidMutation from "@/hooks/useAuctionBidMutation";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { useFindCustomsFeeRate } from "@/hooks/useFindCustomsFeeRate";
import {
  AuctionBidResultEnumJsonldId,
  AuctionItemDTOAuctionBidDTOJsonld,
  AuctionItemDTOAuctionBidResultDTOShopAuctionItemDtoRead,
  AuctionItemDTOJsonldShopAuctionItemDtoRead,
  ExceptionCodeEnumJsonldId,
  ProductVariantJsonldShopProductVariantRead,
  ProductVariantSimilarProductVariantsDTOShopSimilarProductVariantRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { calculateFees } from "@/utils/FeesHandler";
import { sendBidGtmEvent } from "@/utils/gtmUtils";
import { ErrorWithNormalizableErrorCode } from "@/utils/networking-utils";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyArray, isNotNullNorUndefined } from "@/utils/ts-utils";

import AuctionBidHistoryDialog from "../../AuctionBidHistoryDialog/AuctionBidHistoryDialog";
import AuctionBidSurpassedByThresholdDialog from "../../AuctionBidSurpassedByThresholdDialog/AuctionBidSurpassedByThresholdDialog";
import AuctionConfirmationDialog from "../../AuctionConfirmationDialog/AuctionConfirmationDialog";
import AuctionBidThresholdDialog from "../../BiddingThresholdDialog/AuctionBidThresholdDialog";
import InvalidPaymentMethodDialog from "../../ExceptionDialogs/InvalidPaymentMethodDialog";
import MissingDefaultAddressDialog from "../../ExceptionDialogs/MissingDefaultAddressDialog";
import OutdatedBidExceptionDialog from "../../ExceptionDialogs/OutdatedBidExceptionDialog/OutdatedBidExceptionDialog";
import OverdueUnpaidOrdersExceptionDialog from "../../ExceptionDialogs/OverdueUnpaidOrdersExceptionDialog/OverdueUnpaidOrdersExceptionDialog";
import SumOfUnpaidOrdersIsAboveThresholdExceptionDialog from "../../ExceptionDialogs/SumOfUnpaidOrdersIsAboveThresholdExceptionDialog";
import SumOngoingBidsExceptionDialog from "../../ExceptionDialogs/SumOngoingBidsExceptionDialog";
import TotalAmountInformationDialog from "../../TotalAmountInformationDialog/TotalAmountInformationDialog";
import styles from "./AuctionPrice.module.scss";
import CurrentAuctionInformation from "./CurrentAuctionInformation";
import { FinishedAuctionSection } from "./FinishedAuctionSection";

type Props = {
  productVariant: ProductVariantJsonldShopProductVariantRead;
  auctionItem: AuctionItemDTOJsonldShopAuctionItemDtoRead;
  isFinished: boolean;
  similarProductVariants?: ProductVariantSimilarProductVariantsDTOShopSimilarProductVariantRead;
  showLiveIndicator?: boolean;
};

export const AuctionPrice = ({
  productVariant,
  auctionItem,
  isFinished,
  showLiveIndicator,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [openAuctionBidConfirmationDialog, setOpenAuctionBidConfirmationDialog] = useState(false);
  const [openAuctionThresholdConfirmationDialog, setOpenAuctionThresholdConfirmationDialog] =
    useState(false);
  const [openAuctionBidSurpassedByThresholdDialog, setOpenAuctionBidSurpassedByThresholdDialog] =
    useState(false);
  const [openInvalidPaymentMethodDialog, setOpenInvalidPaymentMethodDialog] = useState(false);
  const [openMissingDefaultAddressDialog, setOpenMissingDefaultAddressDialog] = useState(false);
  const [invalidPaymentMethodDialogErrorCode, setInvalidPaymentMethodDialogErrorCode] =
    useState<ExceptionCodeEnumJsonldId>();
  const [openAuctionBidHistoryDialog, setOpenAuctionBidHistoryDialog] = useState(false);
  const [openTotalAmountInformationDialog, setOpenTotalAmountInformationDialog] = useState(false);
  const [openAuctionBidThresholdDialog, setOpenAuctionBidThresholdDialog] = useState(false);
  const [openOutdatedBidException, setOpenOutdatedBidException] = useState(false);
  const [openSumUnpaidOrdersException, setOpenSumUnpaidOrdersException] = useState(false);
  const [openOverdueUnpaidOrdersException, setOpenOverdueUnpaidOrdersException] = useState(false);
  const [openSumOngoingBidsException, setOpenSumOngoingBidsException] = useState(false);

  const { user, cart, numberOfOngoingBids, setNumberOfOngoingBids } = useAuthenticatedUserContext();

  const averageEstimate = isNotNullNorUndefined(productVariant.averageEstimate)
    ? productVariant.averageEstimate
    : 0;
  const historicWinningBids = isNonEmptyArray(auctionItem.historicWinningBids)
    ? auctionItem.historicWinningBids
    : [];

  const initialNextAuctionOrderAmount = isNotNullNorUndefined(auctionItem.highestBid)
    ? getNextStep(auctionItem.highestBid)
    : auctionItem.reserveBid;

  const finalPrice = isNotNullNorUndefined(auctionItem.highestBid)
    ? auctionItem.highestBid
    : auctionItem.reserveBid;

  const { currentDeliveryCountry: countryCode } = useCurrentDeliveryCountry();

  const numberOfBottles = productVariant.numberOfBottles ?? 0;

  const isUserWinning =
    isNotNullNorUndefined(auctionItem.currentWinner) &&
    auctionItem.currentWinner.id?.toString() === user?.id;

  const isUserSeller =
    isNotNullNorUndefined(productVariant.seller) &&
    productVariant.seller.id?.toString() === user?.customerId;

  const isVATrecoverable = productVariant.VATRecoverable ?? false;

  const initialNextThresholdAmount = isNotNullNorUndefined(auctionItem.thresholdBid)
    ? getNextStep(auctionItem.thresholdBid)
    : initialNextAuctionOrderAmount;

  const [isThreshold, setIsThreshold] = useState(false);
  const [thresholdAmount, setThresholdAmount] = useState(initialNextThresholdAmount);

  const potentialBidAmount = isThreshold ? thresholdAmount : initialNextAuctionOrderAmount;
  const auctionBidDTO: AuctionItemDTOAuctionBidDTOJsonld = {
    amount: potentialBidAmount,
    threshold: isThreshold,
  };

  const setThresholdEvent = (thresholdEvent: boolean) => {
    setOpenAuctionBidThresholdDialog(thresholdEvent);
    setIsThreshold(thresholdEvent);
  };

  const customsFeeRate = useFindCustomsFeeRate(countryCode);

  const { allIncludedAmount } = calculateFees(potentialBidAmount, numberOfBottles, customsFeeRate);

  const onSuccess = ({
    result,
    bidId,
  }: AuctionItemDTOAuctionBidResultDTOShopAuctionItemDtoRead) => {
    if (
      result === AuctionBidResultEnumJsonldId.WINNING ||
      result === AuctionBidResultEnumJsonldId.OVERTAKING
    ) {
      if (!(isThreshold && isUserWinning) && isNotNullNorUndefined(numberOfOngoingBids)) {
        setNumberOfOngoingBids(numberOfOngoingBids + 1);
      }

      if (isThreshold) {
        setThresholdEvent(false);
        setTimeout(() => {
          // wait for close animation to finish to prevent price flickering
          setThresholdAmount(_thresholdAmount => getNextStep(_thresholdAmount));
        }, 200);

        setOpenAuctionThresholdConfirmationDialog(true);
        sendBidGtmEvent(
          productVariant,
          allIncludedAmount,
          potentialBidAmount,
          cart?.currencyCode ?? "",
          bidId,
          "max",
          t,
        );

        return;
      }
      setOpenAuctionBidConfirmationDialog(true);
    } else if (result === AuctionBidResultEnumJsonldId.SURPASSED_BY_THRESHOLD) {
      setOpenAuctionBidSurpassedByThresholdDialog(true);
    }
    sendBidGtmEvent(
      productVariant,
      allIncludedAmount,
      potentialBidAmount,
      cart?.currencyCode ?? "",
      bidId,
      "classique",
      t,
    );
  };

  const onError = (error: ErrorWithNormalizableErrorCode) => {
    if (!isAxiosError(error) || error.response.status !== 401) {
      switch (error.response.data.errorCode) {
        case ExceptionCodeEnumJsonldId.a9a26902f:
          setOpenOutdatedBidException(true);
          break;
        case ExceptionCodeEnumJsonldId.b5c3d807e:
          setOpenSumUnpaidOrdersException(true);
          break;
        case ExceptionCodeEnumJsonldId.kb4c6d5e7:
          setOpenOverdueUnpaidOrdersException(true);
          break;
        case ExceptionCodeEnumJsonldId.mxd8mt4ch:
          setOpenAuctionBidSurpassedByThresholdDialog(true);
          break;
        case ExceptionCodeEnumJsonldId.r6p7b6jb2:
          setOpenInvalidPaymentMethodDialog(true);
          setInvalidPaymentMethodDialogErrorCode(ExceptionCodeEnumJsonldId.r6p7b6jb2);
          break;
        case ExceptionCodeEnumJsonldId.xhjDlAo4D:
          setOpenInvalidPaymentMethodDialog(true);
          setInvalidPaymentMethodDialogErrorCode(ExceptionCodeEnumJsonldId.xhjDlAo4D);
          break;
        case ExceptionCodeEnumJsonldId.eUnrn3LSx:
          setOpenInvalidPaymentMethodDialog(true);
          setInvalidPaymentMethodDialogErrorCode(ExceptionCodeEnumJsonldId.eUnrn3LSx);
          break;
        case ExceptionCodeEnumJsonldId.c2U7vrsq6:
          setOpenSumOngoingBidsException(true);
          break;
        case ExceptionCodeEnumJsonldId.O0gWKIx03w:
          setOpenMissingDefaultAddressDialog(true);
          break;
        default:
          toast.error<string>(t("common:common.errorWhileBidding"));
          break;
      }
    }
  };

  const { mutate, isLoading } = useAuctionBidMutation({
    auctionItemCode: auctionItem.code,
    auctionBidDTO,
    onSuccess,
    onError,
  });

  return (
    <div className={clsx(!isUserSeller && styles.auctionBidContainer)}>
      <AuctionConfirmationDialog
        open={openAuctionBidConfirmationDialog}
        setOpen={setOpenAuctionBidConfirmationDialog}
      />
      <AuctionConfirmationDialog
        open={openAuctionThresholdConfirmationDialog}
        setOpen={setOpenAuctionThresholdConfirmationDialog}
        isThreshold
      />
      <AuctionBidSurpassedByThresholdDialog
        open={openAuctionBidSurpassedByThresholdDialog}
        setOpen={setOpenAuctionBidSurpassedByThresholdDialog}
      />
      <MissingDefaultAddressDialog
        open={openMissingDefaultAddressDialog}
        setOpen={setOpenMissingDefaultAddressDialog}
      />
      {invalidPaymentMethodDialogErrorCode !== undefined && (
        <InvalidPaymentMethodDialog
          open={openInvalidPaymentMethodDialog}
          setOpen={setOpenInvalidPaymentMethodDialog}
          errorCode={invalidPaymentMethodDialogErrorCode}
        />
      )}
      <TotalAmountInformationDialog
        open={openTotalAmountInformationDialog}
        setOpen={setOpenTotalAmountInformationDialog}
        potentialBidAmount={isFinished ? finalPrice : potentialBidAmount}
        isVATrecoverable={isVATrecoverable}
        numberOfBottles={numberOfBottles}
        countryCode={countryCode}
      />
      <AuctionBidHistoryDialog
        open={openAuctionBidHistoryDialog}
        setOpen={setOpenAuctionBidHistoryDialog}
        historicWinningBids={historicWinningBids}
      />
      <AuctionBidThresholdDialog
        open={openAuctionBidThresholdDialog}
        setOpen={setThresholdEvent}
        initialNextThresholdAmount={initialNextThresholdAmount}
        numberOfBottles={numberOfBottles}
        countryCode={countryCode}
        thresholdAmount={thresholdAmount}
        setThresholdAmount={setThresholdAmount}
        createAuction={mutate}
        isLoading={isLoading}
        setOpenTotalAmountInformationDialog={setOpenTotalAmountInformationDialog}
      />
      <OutdatedBidExceptionDialog
        open={openOutdatedBidException}
        setOpen={setOpenOutdatedBidException}
      />
      <SumOfUnpaidOrdersIsAboveThresholdExceptionDialog
        open={openSumUnpaidOrdersException}
        setOpen={setOpenSumUnpaidOrdersException}
      />
      <SumOngoingBidsExceptionDialog
        open={openSumOngoingBidsException}
        setOpen={setOpenSumOngoingBidsException}
      />
      <OverdueUnpaidOrdersExceptionDialog
        open={openOverdueUnpaidOrdersException}
        setOpen={setOpenOverdueUnpaidOrdersException}
      />
      <CurrentAuctionInformation
        auctionItem={auctionItem}
        initialNextAuctionOrderAmount={initialNextAuctionOrderAmount}
        countryCode={countryCode}
        numberOfBottles={numberOfBottles}
        setOpenAuctionBidHistoryDialog={setOpenAuctionBidHistoryDialog}
        setOpenTotalAmountInformationDialog={setOpenTotalAmountInformationDialog}
        averageEstimate={averageEstimate}
        isFinished={isFinished}
        showLiveIndicator={showLiveIndicator}
      />
      <div className={styles.auctionActionsContainer}>
        {!isFinished && !isUserSeller && (
          <>
            <Button
              variant="primaryBlack"
              onClick={() => mutate()}
              isLoading={isLoading}
              className={clsx(styles.auctionButton)}
              disabled={isUserWinning}
              id="formenchere"
            >
              {t("acheter-vin:auction.bid")} (
              <Price size="tiny" price={initialNextAuctionOrderAmount} />)
            </Button>

            {isUserWinning && (
              <div>
                <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} size="lg" />
                <span className={styles.userWinningBid}>
                  {t("acheter-vin:auction.userWinningInformation")}
                </span>
                <span className={clsx(styles.userWinningBid, styles.dontShowOnMobile)}>
                  {t("acheter-vin:auction.userWinningDesktopInformation")}
                </span>
              </div>
            )}
            <Button
              variant="secondaryWhite"
              onClick={() => setThresholdEvent(true)}
              className={clsx(styles.auctionButton)}
              id="formenchere-2"
            >
              {t("acheter-vin:auction.thresholdBid")}
            </Button>
            {/* we add isUserWinning condition even if thresholdBid is return only if user is current Winner because getAuctionItemDto is not invalidate on login/lgout */}
            {isUserWinning && isNotNullNorUndefined(auctionItem.thresholdBid) && (
              <div>
                <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} size="lg" />
                <span className={styles.userWinningThresholdBid}>
                  {t("acheter-vin:auction.userWinningThreshold")}{" "}
                  <Price size="small" price={auctionItem.thresholdBid} />
                </span>
              </div>
            )}
          </>
        )}
        {isFinished && (
          <FinishedAuctionSection productVariant={productVariant} auctionItem={auctionItem} />
        )}
        {isUserSeller && !isFinished && (
          <span className={styles.userSellerInformation}>
            {t("acheter-vin:auction.userSellerInformation")}
          </span>
        )}
      </div>
    </div>
  );
};
