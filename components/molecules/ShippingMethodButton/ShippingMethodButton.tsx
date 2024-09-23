import clsx from "clsx";
import Image from "next/image";

import Button from "@/components/atoms/Button/Button";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { ShippingMethodJsonldShopOrderReadCode } from "@/networking/sylius-api-client/.ts.schemas";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./ShippingMethodButton.module.scss";

type ShippingMethodButtonProps = {
  name?: string | null | undefined;
  description?: string | null | undefined;
  isSelected: boolean;
  changeShippingMethod: () => void;
  code?: ShippingMethodJsonldShopOrderReadCode;
  showAutomaticContent?: boolean;
  children?: React.ReactNode;
};

const ShippingMethodButton = ({
  name,
  description,
  isSelected,
  changeShippingMethod,
  code,
  showAutomaticContent = true,
  children,
}: ShippingMethodButtonProps) => {
  const { cart } = useAuthenticatedUserContext();
  const currentCountryCode = cart?.shippingAddress?.countryCode;

  return (
    <Button
      variant="secondaryWhite"
      className={clsx(styles.mainContainer, isSelected && styles.selected)}
      onClick={changeShippingMethod}
    >
      <div className={styles.textContainer}>
        {showAutomaticContent && (
          <>
            <div className={clsx(styles.textName, isSelected && styles.goldenFont)}>
              {name}
              <br />
              {description}
            </div>
            {currentCountryCode === "FR" &&
              code === ShippingMethodJsonldShopOrderReadCode["1-FRANCE-COLISSIMO"] && (
                <Image src="/logoColissimo.jpg" alt="Colissimo" width={100} height={63} />
              )}
            {currentCountryCode === "FR" &&
              code === ShippingMethodJsonldShopOrderReadCode["1-FRANCE-CHRONOPOST-PARTICULIER"] && (
                <Image src="/logoExpress.jpg" alt="Express" width={100} height={63} />
              )}
          </>
        )}
        {isNotNullNorUndefined(children) && (
          <div className={clsx(styles.textDescription, isSelected && styles.goldenFont)}>
            {children}
          </div>
        )}
      </div>
    </Button>
  );
};

export default ShippingMethodButton;
