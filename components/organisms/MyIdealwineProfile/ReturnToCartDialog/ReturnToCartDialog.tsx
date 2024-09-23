import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/router";

import Button from "@/components/atoms/Button/Button";
import Modal from "@/components/molecules/Modal";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useShopValidateBasketOrderItem } from "@/networking/sylius-api-client/order/order";
import { generateUrl } from "@/urls/linksTranslation";
import { ImageFilters } from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ReturnToCartDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ReturnToCartDialog = ({ open, setOpen }: Props): JSX.Element => {
  const { t, lang } = useTranslation();
  const { push } = useRouter();
  const { cart, setCart } = useAuthenticatedUserContext();
  const { mutateAsync: validateMyCart, isLoading } = useShopValidateBasketOrderItem();

  const continueToCart = async () => {
    try {
      const newCart = await validateMyCart({
        tokenValue: cart?.tokenValue ?? "",
        params: { filter: [ImageFilters.CART] },
        data: { couponCode: cart?.couponCode },
      });
      setCart(newCart);
      await push(generateUrl("SHIPPING_URL", lang));
    } catch (error) {
      await push(generateUrl("BASKET_URL", lang));
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>
        {t("accueil-profil:return_to_cart_dialog.title")}
      </Dialog.Title>
      <div className={styles.container}>
        <div className={styles.content}>
          <p>{t("accueil-profil:return_to_cart_dialog.content")}</p>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            variant="primaryBlack"
            className={styles.button}
            onClick={continueToCart}
            isLoading={isLoading}
          >
            {t("accueil-profil:return_to_cart_dialog.button")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReturnToCartDialog;
