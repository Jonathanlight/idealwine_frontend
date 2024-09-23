import { faClock } from "@fortawesome/pro-thin-svg-icons/faClock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import Image from "next/image";

import Button from "@/components/atoms/Button/Button";
import CustomColorCircleIcon from "@/components/atoms/CustomColorCircleIcon/CustomColorCircleIcon";
import CustomCountdown from "@/components/atoms/CustomCountdown";
import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price/Price";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { OrderEventHistoryJsonldShopOrderEventHistoryRead } from "@/networking/sylius-api-client/.ts.schemas";
import ClientOnly, { useClientOnlyValue } from "@/utils/ClientOnly";
import { AVAILABLE_LOCALES } from "@/utils/datesHandler";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./LastOrderSection.module.scss";

type Props = {
  orderEvent: OrderEventHistoryJsonldShopOrderEventHistoryRead;
};

export const LastOrderSection = ({ orderEvent }: Props) => {
  const { t, lang } = useTranslation();

  const IMAGE_SIZE = 200;

  const now = useClientOnlyValue(new Date(), new Date(0));

  const endDate = isNotNullNorUndefined(orderEvent.endDate) ? new Date(orderEvent.endDate) : now;
  const { currentDeliveryCountry: countryCode } = useCurrentDeliveryCountry();

  const triggerDate = format(new Date(orderEvent.triggerDate ?? ""), "dd MMMM yyyy", {
    locale: AVAILABLE_LOCALES[lang],
  });

  const triggerHour = format(new Date(orderEvent.triggerDate ?? ""), "HH:mm:ss", {
    locale: AVAILABLE_LOCALES[lang],
  });

  const imageUrl =
    isNotNullNorUndefined(orderEvent.imageUrl) && orderEvent.imageUrl !== ""
      ? orderEvent.imageUrl
      : `/_no_picture_${lang}.jpg`;
  const currentCountryPrice = orderEvent.priceByCountry?.[countryCode];

  return (
    <div className={styles.lastOrderSectionContainer}>
      <Image
        unoptimized
        src={imageUrl}
        alt="last-order-photo"
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        className={styles.image}
      />
      <div className={styles.lotInfoContainer}>
        <div className={styles.lotInfo}>
          <span className={styles.saleType}>
            {orderEvent.auction
              ? t("last-order:auctionTitle", { triggerDate, triggerHour })
              : t("last-order:directPurchaseTitle", { triggerDate, triggerHour })}
          </span>
          <div className={styles.lotDescription}>
            <span className={styles.lotName}>
              <CustomColorCircleIcon colorVariant={orderEvent.color} />
              {t(`common:enum.format.${orderEvent.format ?? "INCONNU"}`, {
                count: orderEvent.numberOfBottles,
              })}{" "}
              {orderEvent.variantNames?.[nextLangToSyliusLocale(lang)] ?? ""}
            </span>
            <span className={styles.lotRegion}>{t(`enums:region.${orderEvent.region ?? ""}`)}</span>
            {isNotNullNorUndefined(orderEvent.endDate) && (
              <ClientOnly>
                <span className={styles.remainingTime}>
                  <FontAwesomeIcon icon={faClock} />
                  <CustomCountdown date={endDate} timeoutMessage={t("last-order:timeoutMessage")} />
                </span>
              </ClientOnly>
            )}
          </div>
          <div />
          <div />
        </div>
        <div className={styles.priceSection}>
          <Price price={currentCountryPrice ?? 0} size="medium" />
          <span>{t(`last-order:${orderEvent.auction ? "currentPrice" : "netPrice"}`)}</span>
          <PdpLink variant={orderEvent}>
            <Button variant="primaryBlack">{t("last-order:seeLot")}</Button>
          </PdpLink>
        </div>
      </div>
    </div>
  );
};
