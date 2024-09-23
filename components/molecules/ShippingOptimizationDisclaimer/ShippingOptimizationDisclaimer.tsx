import { faBoxesStacked } from "@fortawesome/pro-light-svg-icons/faBoxesStacked";
import { faCircleXmark } from "@fortawesome/pro-thin-svg-icons/faCircleXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Trans from "next-translate/Trans";
import { useState } from "react";

import Price from "@/components/molecules/Price";
import { CartWithShippingMethodConfiguration } from "@/types/Carts";
import { SHIPPING_CALCULATOR_SMALL_CAPACITY } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";
import { getShippingFeesOptimizations } from "@/utils/shippingFees";

import styles from "./ShippingOptimizationDisclaimer.module.scss";

type Props = {
  paymentMethod?: CartWithShippingMethodConfiguration["shipments"][0]["method"];
  bottles: number;
  magnums: number;
  others: number;
};

const ShippingOptimizationDisclaimer = ({ paymentMethod, bottles, magnums, others }: Props) => {
  const { t } = useTranslation("shipping-optimization");
  const [userClosedShippingOptimization, setUserClosedShippingOptimization] = useState(false);

  const proposeBottles = SHIPPING_CALCULATOR_SMALL_CAPACITY - 1;
  const proposePrice = paymentMethod?.configuration.slice1 ?? 0;

  const { isOptimized, canProposeMoreBottles, remainingBottlesToOptim, remainingMagnumsToOptim } =
    getShippingFeesOptimizations(bottles, magnums, others);

  return userClosedShippingOptimization ? (
    <></>
  ) : (
    <div
      className={clsx(
        styles.countdownContainer,
        isOptimized ? styles.shippingOptimized : styles.shippingUnoptimized,
      )}
    >
      <FontAwesomeIcon icon={faBoxesStacked} />{" "}
      <div className={styles.shipping}>
        {isOptimized ? (
          <div>
            <p>{t("shippingOptimized")}</p>
            {canProposeMoreBottles && (
              <p>
                <Trans
                  ns="shipping-optimization"
                  i18nKey={"shippingOptimizedHelper"}
                  components={[<Price key={0} size="small" price={proposePrice} />]}
                  values={{ count: proposeBottles }}
                />
              </p>
            )}
          </div>
        ) : (
          <div>
            <p>{t("shippingUnoptimized")}</p>
            {remainingBottlesToOptim !== 0 && (
              <p>
                {t("shippingUnoptimizedHelperBottles", {
                  count: remainingBottlesToOptim,
                })}
              </p>
            )}
            {remainingMagnumsToOptim !== 0 && (
              <p>
                {t("shippingUnoptimizedHelperMagnums", {
                  count: remainingMagnumsToOptim,
                })}
              </p>
            )}
          </div>
        )}

        <FontAwesomeIcon
          size="xl"
          icon={faCircleXmark}
          onClick={() => setUserClosedShippingOptimization(true)}
          className={styles.closeIcon}
        />
      </div>
    </div>
  );
};

export default ShippingOptimizationDisclaimer;
