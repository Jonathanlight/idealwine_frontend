import Image from "next/image";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { useTranslation } from "@/utils/next-utils";

import styles from "./EmptyCart.module.scss";

const EmptyCart = (): JSX.Element => {
  const { t } = useTranslation("panier");

  return (
    <div className={styles.mainContainer}>
      <Image src={"/empty_cart.png"} alt={"empty cart"} width={150} height={150} />
      <p className={styles.emptyCartText}>{t("noItemsInBasket")}</p>
      <TranslatableLink href="BUY_WINE_URL" className={styles.buttonLink}>
        <Button variant="primaryBlack">{t("seeAllWines")}</Button>
      </TranslatableLink>
    </div>
  );
};

export default EmptyCart;
