import React from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";

import ClientOnly from "@/utils/ClientOnly";
import { useTranslation } from "@/utils/next-utils";

type Props = {
  date: Date;
  timeoutMessage: string;
  secondsPrecision?: boolean;
};

const CustomCountdown = ({ date, timeoutMessage, secondsPrecision = false }: Props) => {
  const { t } = useTranslation("common");

  const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds }) => {
    const isTimeTicking = days > 0 || hours > 0 || minutes > 0 || seconds > 0;

    return isTimeTicking ? (
      days > 0 ? (
        <>
          {t("countdown.days", { count: days })} {t("countdown.hours", { count: hours })}{" "}
          {t("countdown.minutes", { count: minutes })}
        </>
      ) : hours > 0 ? (
        <>
          {t("countdown.hours", { count: hours })} {t("countdown.minutes", { count: minutes })}
        </>
      ) : minutes > 0 ? (
        <>
          {t("countdown.minutes", { count: minutes })}{" "}
          {secondsPrecision && t("countdown.seconds", { count: seconds })}
        </>
      ) : (
        <>
          {secondsPrecision
            ? t("countdown.seconds", { count: seconds })
            : t("countdown.lessThanOneMinute")}
        </>
      )
    ) : (
      <>{timeoutMessage}</>
    );
  };

  return (
    <ClientOnly>
      <Countdown date={date} renderer={renderer} />
    </ClientOnly>
  );
};

export default CustomCountdown;
