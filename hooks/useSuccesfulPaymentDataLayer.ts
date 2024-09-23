import { sendGTMEvent } from "@next/third-parties/google";
import { useSessionStorageValue } from "@react-hookz/web";
import { useEffect } from "react";

import { TRANSACTION_CONFIRMATION_DATALAYER_EVENT } from "@/utils/sessionStorageKeys";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

const useSuccesfulPaymentDataLayer = () => {
  const {
    value: transactionConfirmationDatalayerEventValue,
    remove: removeTransactionConfirmationDatalayerEventValue,
  } = useSessionStorageValue(TRANSACTION_CONFIRMATION_DATALAYER_EVENT);

  useEffect(() => {
    if (isNotNullNorUndefined(transactionConfirmationDatalayerEventValue)) {
      sendGTMEvent({ ecommerce: null });
      sendGTMEvent({
        event: "transactionConfirmation",
        ecommerce: transactionConfirmationDatalayerEventValue,
      });
      removeTransactionConfirmationDatalayerEventValue();
    }
  }, [
    transactionConfirmationDatalayerEventValue,
    removeTransactionConfirmationDatalayerEventValue,
  ]);
};

export const SuccesfulPaymentDataLayer = () => {
  useSuccesfulPaymentDataLayer();

  return null;
};
