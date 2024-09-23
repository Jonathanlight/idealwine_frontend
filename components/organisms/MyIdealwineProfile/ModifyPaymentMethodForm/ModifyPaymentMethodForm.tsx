import { faCircleCheck } from "@fortawesome/pro-light-svg-icons/faCircleCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { CustomerJsonldShopCustomerRead } from "@/networking/sylius-api-client/.ts.schemas";
import {
  useShopCreditCardVerificationCustomerItem,
  useShopPutCustomerItem,
} from "@/networking/sylius-api-client/customer/customer";
import { generateAbsoluteUrl, generateUrl } from "@/urls/linksTranslation";
import { PAYMENT_METHOD_CODES, PaymentMethodIcons } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import BankTranferRequestDialog from "../../BankTranferRequestDialog/BankTranferRequestDialog";
import SelectBox from "../../GeneralCheckout/SelectBox/SelectBox";
import styles from "./ModifyPaymentMethodForm.module.scss";

const CREDIT_CARD_VERIFICATION_STATUS_QUERY_PARAM = "credit_card_verification";
const CREDIT_CARD_VERIFICATION_STATUS_SUCCESS = "success";
const CREDIT_CARD_VERIFICATION_STATUS_FAILURE = "failure";

type UserPaymentMethod = typeof PAYMENT_METHOD_CODES[keyof typeof PAYMENT_METHOD_CODES] | null;

const userPaymentMethodCode = (customer: CustomerJsonldShopCustomerRead): UserPaymentMethod => {
  switch (customer.paymentMethod?.code) {
    case PAYMENT_METHOD_CODES.BANK_TRANSFER:
      return PAYMENT_METHOD_CODES.BANK_TRANSFER;
    case PAYMENT_METHOD_CODES.CREDIT_CARD:
      return PAYMENT_METHOD_CODES.CREDIT_CARD;
    default:
      return null;
  }
};

type Props = {
  customer: CustomerJsonldShopCustomerRead;
};

const ModifyPaymentMethodForm = ({ customer }: Props): JSX.Element => {
  const [paymentMethod, setPaymentMethod] = useState<UserPaymentMethod>(
    userPaymentMethodCode(customer),
  );
  const [isBankTranferModalOpen, setIsBankTranferModalOpen] = useState(false);

  const { t } = useTranslation();

  const { user } = useAuthenticatedUserContext();

  const { mutateAsync: putCustomer, isLoading: isPuttingCustomer } =
    useShopPutCustomerItem<AxiosError>();

  const { lang } = useTranslation();
  const { push, query, pathname, replace } = useRouter();

  const creditCardValidationStatus = query[CREDIT_CARD_VERIFICATION_STATUS_QUERY_PARAM];

  useEffect(() => {
    if (typeof creditCardValidationStatus === "string") {
      if (creditCardValidationStatus === CREDIT_CARD_VERIFICATION_STATUS_FAILURE) {
        void toast.error<string>(t("accueil-profil:validationFailure"), {
          autoClose: false,
          theme: "colored",
        });
      } else if (creditCardValidationStatus === CREDIT_CARD_VERIFICATION_STATUS_SUCCESS) {
        void toast.success<string>(t("accueil-profil:validationSuccess"));
      }
      // Erases the query string from the URL, so a refresh/back page won't trigger the toast again
      void replace({ pathname, query: "" }, undefined, { shallow: true });
    }
  }, [creditCardValidationStatus, pathname, replace, t]);

  const { mutateAsync: generateCCValidationUrl, isLoading: isGeneratingPaymentUrl } =
    useShopCreditCardVerificationCustomerItem();

  const validateCreditCard = async () => {
    const urlBack = generateAbsoluteUrl("MY_IDEALWINE_HOME_URL", lang, undefined);
    const urlAfterSuccess = generateAbsoluteUrl(
      "MY_IDEALWINE_HOME_URL",
      lang,
      undefined,
      new URLSearchParams({
        [CREDIT_CARD_VERIFICATION_STATUS_QUERY_PARAM]: CREDIT_CARD_VERIFICATION_STATUS_SUCCESS,
      }),
    );
    const urlAfterFailure = generateAbsoluteUrl(
      "MY_IDEALWINE_HOME_URL",
      lang,
      undefined,
      new URLSearchParams({
        [CREDIT_CARD_VERIFICATION_STATUS_QUERY_PARAM]: CREDIT_CARD_VERIFICATION_STATUS_FAILURE,
      }),
    );

    const { url } = await generateCCValidationUrl({
      id: user?.customerId ?? "",
      data: { urlAfterSuccess, urlAfterFailure, urlBack },
    });

    if (url !== undefined) await push(`${url}&language=${lang}`);
  };

  const validatePaymentMethod = async () => {
    switch (paymentMethod) {
      case PAYMENT_METHOD_CODES.BANK_TRANSFER:
        await putCustomer({
          id: user?.customerId ?? "",
          data: { paymentMethod: "/api/v2/shop/payment-methods/bank_transfer" },
        });
        sendGTMEvent({ event: "formSubmit", goalType: "validation_paiement_user" });
        setIsBankTranferModalOpen(true);
        break;
      case PAYMENT_METHOD_CODES.CREDIT_CARD: {
        try {
          await putCustomer({
            id: user?.customerId ?? "",
            data: { paymentMethod: "/api/v2/shop/payment-methods/credit_card" },
          });
          sendGTMEvent({ event: "formSubmit", goalType: "validation_paiement_user" });
          await validateCreditCard();
        } catch (e) {
          toast.error<string>(t("common:common.errorOccurred"));
        }
        break;
      }
      case null: {
        void toast.error<string>(t("accueil-profil:choosePaymentMethod"));
      }
    }
  };

  const onConfirmBankTransfer = () => {
    try {
      setIsBankTranferModalOpen(false);
      void window.open(generateUrl("BANK_TRANSFER_FORM_URL", lang), "_blank");
    } catch (e) {
      toast.error<string>(t("common:common.errorOccurred"));
    }
  };

  const cardDescription = (
    <div>
      {t("accueil-profil:creditCardDescription")}
      {isNotNullNorUndefined(customer.creditCardValidatedAt) ? (
        <div>
          {t("accueil-profil:creditCardValidated", {
            validatedAt: new Date(customer.creditCardValidatedAt).toLocaleString("fr"),
          })}
          <FontAwesomeIcon className={styles.icon} size="1x" color="green" icon={faCircleCheck} />
        </div>
      ) : paymentMethod === PAYMENT_METHOD_CODES.CREDIT_CARD ? (
        <div>{t("accueil-profil:creditCardNotValidated")}</div>
      ) : null}
    </div>
  );

  return (
    <div id="myPaymentMethod" className={styles.bigCard}>
      <h1>{t("accueil-profil:paymentMethod")}</h1>
      <hr />
      <p>{t("accueil-profil:paymentMethodChoice")}</p>

      <SelectBox
        title={t("accueil-profil:creditCard")}
        description={cardDescription}
        className={styles.selectBox}
        isSelected={paymentMethod === PAYMENT_METHOD_CODES.CREDIT_CARD}
        iconUrl={PaymentMethodIcons.credit_card}
        onSelect={() => setPaymentMethod(PAYMENT_METHOD_CODES.CREDIT_CARD)}
      />
      <SelectBox
        title={t("accueil-profil:bankTransfer")}
        description={t("accueil-profil:bankTransferDescription")}
        className={styles.selectBox}
        isSelected={paymentMethod === PAYMENT_METHOD_CODES.BANK_TRANSFER}
        iconUrl={PaymentMethodIcons.bank_transfer}
        onSelect={() => setPaymentMethod(PAYMENT_METHOD_CODES.BANK_TRANSFER)}
      />

      <Button
        variant="primaryBlack"
        onClick={validatePaymentMethod}
        isLoading={isPuttingCustomer || isGeneratingPaymentUrl}
      >
        {t("common:common.submitForm")}
      </Button>

      <BankTranferRequestDialog
        open={isBankTranferModalOpen}
        setOpen={setIsBankTranferModalOpen}
        onClickConfirm={onConfirmBankTransfer}
      />
    </div>
  );
};

export default ModifyPaymentMethodForm;
