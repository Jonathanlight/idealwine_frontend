import clsx from "clsx";
import { useEffect, useState } from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";

import { AuctionItemDTOJsonldShopAuctionItemDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import ClientOnly from "@/utils/ClientOnly";
import { nextLangToNextDateLocaleStringForAuction } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./AuctionCountdown.module.scss";

type Props = {
  auctionItem: AuctionItemDTOJsonldShopAuctionItemDtoRead;
  isFinished: boolean;
  clientAndServerTimeDifference: number;
};

const PARIS_TIME_ZONE = "Europe/Paris";

const AuctionCountdown = ({
  auctionItem,
  isFinished,
  clientAndServerTimeDifference,
}: Props): JSX.Element => {
  const { t, lang } = useTranslation("acheter-vin");

  const auctionCatalogEndDate = isNotNullNorUndefined(auctionItem.endDate)
    ? auctionItem.endDate
    : null;

  const date: Date | string = auctionCatalogEndDate !== null ? new Date(auctionCatalogEndDate) : "";
  const dateNumber = +date;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const longEndDate = date.toLocaleString(nextLangToNextDateLocaleStringForAuction(lang), {
    dateStyle: "long",
    timeStyle: "medium",
  });

  const shortEndDate = date.toLocaleString(nextLangToNextDateLocaleStringForAuction(lang), {
    dateStyle: "short",
    timeStyle: "medium",
  });

  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    if (countdown && dateNumber > Date.now() + clientAndServerTimeDifference) countdown.start();
  }, [countdown, dateNumber, clientAndServerTimeDifference]);

  const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds }) => {
    const remainingDays: string = t("acheter-vin:auction_countdown.days", { count: days });
    const remainingHours: string = t("acheter-vin:auction_countdown.hours", { count: hours });
    const remainingMinutes: string = t("acheter-vin:auction_countdown.minutes", { count: minutes });
    const remainingSeconds: string = t("acheter-vin:auction_countdown.seconds", { count: seconds });

    const remainingTime: string =
      days === 0
        ? hours === 0
          ? minutes === 0
            ? seconds === 0 && isFinished
              ? t("acheter-vin:auction_countdown.auctionOver")
              : t("acheter-vin:auction_countdown.remainingSeconds", {
                  remainingSeconds,
                })
            : t("acheter-vin:auction_countdown.remainingMinutesAndSeconds", {
                remainingMinutes,
                remainingSeconds,
              })
          : t("acheter-vin:auction_countdown.remainingHoursAndMinutes", {
              remainingHours,
              remainingMinutes,
            })
        : hours === 0
        ? t("acheter-vin:auction_countdown.remainingDays", {
            remainingDays,
          })
        : t("acheter-vin:auction_countdown.remainingDaysAndHours", {
            remainingDays,
            remainingHours,
          });

    return (
      <div
        className={clsx(
          styles.countdown,
          auctionItem.overtimeBiddingEnabled && !isFinished
            ? styles.redCountdown
            : styles.goldenCountdown,
          isFinished && styles.blackCountdown,
        )}
      >
        <div className={styles.remainingTime}>{remainingTime}</div>
        <div className={styles.endDates}>
          <span className={styles.longEndDate}>{longEndDate} </span>
          <span className={styles.shortEndDate}>{shortEndDate} </span>
          <span>
            {timeZone === PARIS_TIME_ZONE
              ? t("acheter-vin:timeZoneName")
              : t("acheter-vin:inYourTimeZone")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <ClientOnly>
      <Countdown
        date={date}
        now={() => Date.now() + clientAndServerTimeDifference}
        precision={3}
        intervalDelay={200}
        renderer={renderer}
        autoStart={false}
        ref={setCountdown}
      />
    </ClientOnly>
  );
};

export default AuctionCountdown;
