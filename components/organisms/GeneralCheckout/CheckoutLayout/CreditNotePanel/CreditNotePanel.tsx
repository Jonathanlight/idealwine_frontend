import { isAxiosError } from "axios";
import { format } from "date-fns";
import Trans from "next-translate/Trans";
import { toast } from "react-toastify";

import Switch from "@/components/atoms/Switch";
import Price from "@/components/molecules/Price";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import {
  CreditNoteJsonldShopCreditNotesRead,
  ExceptionCodeEnumJsonldId,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  useShopAddCreditNoteToCartOrderItem,
  useShopRemoveCreditNoteFromCartOrderItem,
} from "@/networking/sylius-api-client/order/order";
import { AVAILABLE_LOCALES } from "@/utils/datesHandler";
import { ImageFilters } from "@/utils/imageFilters";
import { ErrorWithNormalizableErrorCode } from "@/utils/networking-utils";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./CreditNotePanel.module.scss";

type Props = {
  creditNotes: CreditNoteJsonldShopCreditNotesRead[];
};

const CreditNotePanel = ({ creditNotes }: Props) => {
  const { t, lang } = useTranslation("common");
  const { cart, setCart } = useAuthenticatedUserContext();

  const { mutateAsync: addCreditNoteToCart, isLoading: addCreditNoteToCartLoading } =
    useShopAddCreditNoteToCartOrderItem();

  const { mutateAsync: removeCreditNoteToCart, isLoading: removeCreditNoteToCartLoading } =
    useShopRemoveCreditNoteFromCartOrderItem();

  const handleSwitchChange = async (creditNote: CreditNoteJsonldShopCreditNotesRead) => {
    const creditNoteId = creditNote.id ?? 0;
    const handler = isCreditNoteInCart(creditNote) ? removeCreditNoteToCart : addCreditNoteToCart;

    try {
      const newCart = await handler({
        tokenValue: cart?.tokenValue ?? "",
        data: { creditNoteId },
        params: { filter: [ImageFilters.CART] },
      });
      setCart(newCart);
    } catch (e) {
      if (isAxiosError(e)) {
        switch ((e as ErrorWithNormalizableErrorCode).response.data.errorCode) {
          case ExceptionCodeEnumJsonldId.K4m7L0sF6:
            toast.error<string>(
              <Trans
                ns="common"
                i18nKey={"cart.errors.K4m7L0sF6"}
                components={[<Price key={0} size="small" price={creditNote.minimumAmount ?? 0} />]}
              />,
            );
            break;
          case ExceptionCodeEnumJsonldId.Oz1m7L0sF6:
            toast.error<string>(t("common:cart.errors.Oz1m7L0sF6"));
            break;
        }
      } else {
        toast.error<string>(t("common.errorOccurred"));
      }
    }
  };

  const isCreditNoteInCart = (creditNote: CreditNoteJsonldShopCreditNotesRead) => {
    const creditNoteIdsInCart = cart?.creditNotes?.map(cartCreditNote => cartCreditNote.id) ?? [];

    return creditNoteIdsInCart.includes(creditNote.id);
  };

  return (
    <div className={styles.mainContainer}>
      {creditNotes.map((creditNote, iter) => {
        const PriceComponent = <Price size="small" price={creditNote.amount ?? 0} />;

        const [transKey, creditNoteDate] = isNotNullNorUndefined(creditNote.startDate)
          ? ["creditNoteLabelWithStartDateAndPrice", creditNote.startDate]
          : isNotNullNorUndefined(creditNote.enabledAt)
          ? ["creditNoteLabelWithEnabledAtAndPrice", creditNote.enabledAt]
          : ["creditNoteLabelWithPrice"];

        return (
          <div className={styles.switchContainer} key={iter}>
            <Switch
              checked={isCreditNoteInCart(creditNote)}
              onChange={() => handleSwitchChange(creditNote)}
              size="small"
              disabled={removeCreditNoteToCartLoading || addCreditNoteToCartLoading}
            />
            <label htmlFor={creditNote["@id"]}>
              <Trans
                ns="common"
                i18nKey={transKey}
                components={[PriceComponent]}
                values={{
                  date: isNotNullNorUndefined(creditNoteDate)
                    ? format(new Date(creditNoteDate), "d MMMM yyyy", {
                        locale: AVAILABLE_LOCALES[lang],
                      })
                    : "",
                }}
              />
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default CreditNotePanel;
