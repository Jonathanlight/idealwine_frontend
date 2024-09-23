import { format } from "date-fns";
import Image from "next/image";

import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { OrderEventHistoryJsonldShopOrderEventHistoryRead } from "@/networking/sylius-api-client/.ts.schemas";
import { AVAILABLE_LOCALES } from "@/utils/datesHandler";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./LastOrderCard.module.scss";

type Props = {
  closeNavigationMenu: () => void;
  orderEvent: OrderEventHistoryJsonldShopOrderEventHistoryRead;
};

const LastOrderCard = ({ closeNavigationMenu, orderEvent }: Props) => {
  const { t, lang } = useTranslation("common");
  const { currentDeliveryCountry: countryCode } = useCurrentDeliveryCountry();
  const triggerHour = format(new Date(orderEvent.triggerDate ?? ""), "HH:mm:ss", {
    locale: AVAILABLE_LOCALES[lang],
  });

  const imageUrl =
    isNotNullNorUndefined(orderEvent.imageUrl) && orderEvent.imageUrl !== ""
      ? orderEvent.imageUrl
      : `/_no_picture_${lang}.jpg`;
  const currentCountryPrice = orderEvent.priceByCountry?.[countryCode];

  return (
    <PdpLink variant={orderEvent} className={styles.link} onClick={closeNavigationMenu}>
      <figure className={styles.mainContainer}>
        <span className={styles.remainingTime}>
          {t("header.dynamicMenu.auctionTriggerHour", { triggerHour })}
        </span>
        <Image
          unoptimized
          src={imageUrl}
          alt="Lot picture"
          height={112}
          width={150}
          className={styles.image}
        />
        <figcaption className={styles.caption}>
          <p className={styles.lotName}>
            {t(`enum.format.${orderEvent.format ?? "INCONNU"}`, {
              count: orderEvent.numberOfBottles,
            })}{" "}
            {orderEvent.variantName ?? ""}
          </p>
          <Price price={currentCountryPrice ?? 0} size="small" className={styles.price} />
        </figcaption>
      </figure>
    </PdpLink>
  );
};

export default LastOrderCard;
