import { isAxiosError } from "axios";
import { Path, SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { OrderUpdateCartJsonldShopCartUpdate } from "@/networking/sylius-api-client/.ts.schemas";
import { useShopPutOrderItem } from "@/networking/sylius-api-client/order/order";
import { ConstraintViolationList } from "@/networking/types";
import { ImageFilters } from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined, isNullOrUndefined } from "@/utils/ts-utils";

import styles from "./CodePromoPanel.module.scss";

const CodePromoPanel = () => {
  const { cart, setCart } = useAuthenticatedUserContext();

  const { mutateAsync: putCoupon, isLoading } = useShopPutOrderItem();

  const { t } = useTranslation("common");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OrderUpdateCartJsonldShopCartUpdate>({ reValidateMode: "onSubmit" });

  const onSubmit: SubmitHandler<OrderUpdateCartJsonldShopCartUpdate> = async ({ couponCode }) => {
    try {
      if (isNotNullNorUndefined(cart?.couponCode)) {
        const newCart = await putCoupon({
          tokenValue: cart?.tokenValue ?? "",
          params: { filter: [ImageFilters.CART] },
          data: { couponCode: null },
        });
        setCart(newCart);
      } else {
        const newCart = await putCoupon({
          tokenValue: cart?.tokenValue ?? "",
          params: { filter: [ImageFilters.CART] },
          data: { couponCode },
        });
        setCart(newCart);
      }
    } catch (err) {
      if (!isAxiosError(err) || err.response?.status !== 422) return;
      const { violations } = err.response.data as ConstraintViolationList<
        Path<OrderUpdateCartJsonldShopCartUpdate>
      >;
      violations.forEach(({ propertyPath, message }) => {
        if (propertyPath !== "") setError(propertyPath, { message });
      });
    }
  };

  return (
    <div className={styles.mainContainer}>
      <span className={styles.title}>
        {isNotNullNorUndefined(cart?.couponCode) ? t("removeCoupon") : ""}
      </span>
      <form className={styles.inputContainer} onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          {...register("couponCode", {
            required: {
              value: isNullOrUndefined(cart?.couponCode),
              message: t("common:form.requiredField"),
            },
          })}
          error={errors.couponCode?.message}
          placeholder={cart?.couponCode ?? t("addACouponOrCreditNote")}
          disabled={isNotNullNorUndefined(cart?.couponCode)}
          inputClassName={styles.promotionCodeInput}
        />
        <Button variant="primaryBlack" isLoading={isLoading} className={styles.buttonSubmit}>
          {t(isNotNullNorUndefined(cart?.couponCode) ? "removeButton" : "addButton")}
        </Button>
      </form>
    </div>
  );
};

export default CodePromoPanel;
