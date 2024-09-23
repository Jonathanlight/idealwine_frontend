import { faInfoCircle } from "@fortawesome/pro-light-svg-icons/faInfoCircle";
import { faCircle } from "@fortawesome/pro-solid-svg-icons/faCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import Button from "@/components/atoms/Button/Button";
import Price from "@/components/molecules/Price/Price";
import { useFindCustomsFeeRate } from "@/hooks/useFindCustomsFeeRate";
import { AuctionItemDTOJsonldShopAuctionItemDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { calculateFees } from "@/utils/FeesHandler";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./CurrentAuctionInformation.module.scss";

type Props = {
  auctionItem: AuctionItemDTOJsonldShopAuctionItemDtoRead;
  initialNextAuctionOrderAmount: number;
  countryCode: string;
  numberOfBottles: number;
  setOpenAuctionBidHistoryDialog: (open: boolean) => void;
  setOpenTotalAmountInformationDialog: (open: boolean) => void;
  isFinished: boolean;
  averageEstimate: number;
  showLiveIndicator?: boolean;
};

const CurrentAuctionInformation = ({
  auctionItem,
  initialNextAuctionOrderAmount,
  countryCode,
  numberOfBottles,
  setOpenAuctionBidHistoryDialog,
  setOpenTotalAmountInformationDialog,
  averageEstimate,
  isFinished,
  showLiveIndicator,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const customsFeeRate = useFindCustomsFeeRate(countryCode);
  const finalPrice = isNotNullNorUndefined(auctionItem.highestBid)
    ? auctionItem.highestBid
    : auctionItem.reserveBid;

  const { allIncludedAmount } = calculateFees(
    !isFinished ? initialNextAuctionOrderAmount : finalPrice,
    numberOfBottles,
    customsFeeRate,
  );

  return (
    <div className={styles.auctionCurrentInformationsContainer}>
      <div className={styles.priceContainer}>
        <div className={clsx(styles.live, styles.dontShowOnLargeOrExtraLargeDesktop)}>
          {showLiveIndicator && (
            <FontAwesomeIcon className={styles.liveDot} icon={faCircle} size="sm" />
          )}
        </div>
        <Price
          price={!isFinished ? initialNextAuctionOrderAmount : finalPrice}
          size="big"
          className={clsx(styles.initialNextAuctionOrderAmount, {
            [styles.initialNextAuctionOrderAmountFinished]: isFinished,
          })}
        />
      </div>
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
      <div className={clsx(styles.live, styles.showOnlyOnLargeDesktop)}>
        {showLiveIndicator && (
          <>
            <FontAwesomeIcon className={styles.liveDot} icon={faCircle} size="sm" />
            &nbsp;&nbsp;{t(`acheter-vin:auction.live`)}
          </>
        )}
      </div>
      <div className={clsx(styles.group)}>
        <Button
          variant="primaryBlack"
          onClick={() => {
            setOpenAuctionBidHistoryDialog(true);
          }}
          className={clsx(styles.numberOfBidsButton)}
        >
          {!isFinished
            ? t(`acheter-vin:auction.numberOfBids`, {
                count: auctionItem.numberOfBids,
              })
            : t(`acheter-vin:auction.showHistory`)}
        </Button>
        <div className={clsx(styles.auctionInfo)}>
          <span className={styles.property}>
            <span>
              {t(`acheter-vin:auction.reserveBid`)}
              <Price size="tinier" price={auctionItem.reserveBid} />
            </span>
            <span>
              {t(`acheter-vin:auction.averageEstimate`)}
              <Price size="tinier" price={averageEstimate} />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrentAuctionInformation;
