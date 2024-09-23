import { faInfoCircle } from "@fortawesome/pro-light-svg-icons/faInfoCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Countdown, { CountdownRendererFn } from "react-countdown";

import { OrderJsonldShopCartRead } from "@/networking/sylius-api-client/.ts.schemas";
import ClientOnly from "@/utils/ClientOnly";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

type Props = {
  cart: OrderJsonldShopCartRead;
};

const CartCountdown = ({ cart }: Props): JSX.Element => {
  const { t } = useTranslation("checkout-common");
  const date: Date | string = isNotNullNorUndefined(cart.expirationDate)
    ? new Date(cart.expirationDate)
    : "";

  const renderer: CountdownRendererFn = ({ minutes, seconds }) => {
    const isTimeTicking = minutes > 0 || seconds > 0;
    const minutesDisplayed = minutes.toString().padStart(2, "0");
    const secondsDisplayed = seconds.toString().padStart(2, "0");

    return isTimeTicking ? (
      <>
        <FontAwesomeIcon icon={faInfoCircle} />{" "}
        {t("countdown", { minutesDisplayed, secondsDisplayed })}
      </>
    ) : (
      t("tooLate")
    );
  };

  return (
    <ClientOnly>
      {isNotNullNorUndefined(cart.expirationDate) && <Countdown date={date} renderer={renderer} />}
    </ClientOnly>
  );
};

export default CartCountdown;
