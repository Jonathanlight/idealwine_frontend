import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import { GetCreditNoteCollectionParams } from "@/networking/sylius-api-client/.ts.schemas";
import {
  getGetCreditNoteCollectionQueryKey,
  useGetCreditNoteCollection,
  usePatchCreditNoteItem,
} from "@/networking/sylius-api-client/credit-note/credit-note";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyArray, isNotNullNorUndefined } from "@/utils/ts-utils";

import Price from "../Price";
import styles from "./LoyaltyCreditNotesSection.module.scss";

const LoyaltyCreditNotesSection = () => {
  const { t, lang } = useTranslation("accueil-profil");
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState<boolean>(false);

  const profileFilters: GetCreditNoteCollectionParams = {
    available_credit_notes: true,
    valid_credit_notes: true,
    "type[]": ["LOYALTY_CREDIT_NOTE", "GIFT_VOUCHER"],
    pagination: !showAll,
    itemsPerPage: showAll ? undefined : 5,
  };

  const {
    data: availableCreditNotes,
    isError,
    isFetching: isFetchingCreditNotes,
  } = useGetCreditNoteCollection(profileFilters, {
    query: { keepPreviousData: true },
  });
  const { mutateAsync: enableCreditNote, isLoading } = usePatchCreditNoteItem();

  const activateCreditNote = async (creditNoteId: number) => {
    try {
      const newCreditNote = await enableCreditNote({
        id: String(creditNoteId),
        data: {},
      });

      queryClient.setQueryData(getGetCreditNoteCollectionQueryKey(profileFilters), {
        ...availableCreditNotes,
        "hydra:member": [
          ...(availableCreditNotes?.["hydra:member"]?.map(item =>
            item.id === creditNoteId ? newCreditNote : item,
          ) ?? []),
        ],
      });

      toast.success<string>(t("loyaltyProgramMenu.LoyaltyCreditNotesTable.creditNoteActivated"));
    } catch (error) {
      toast.error<string>(t("common:common.errorOccurred"));

      return;
    }
  };

  return (
    <div className={styles.mainContainer}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>{t("loyaltyProgramMenu.LoyaltyCreditNotesTable.orderNumber")}</th>
            <th className={styles.dontShowOnMobileOrTablet}>
              {t("loyaltyProgramMenu.LoyaltyCreditNotesTable.orderDate")}
            </th>
            <th className={styles.dontShowOnMobileOrTablet}>
              {t("loyaltyProgramMenu.LoyaltyCreditNotesTable.type")}
            </th>
            <th className={styles.dontShowOnMobileOrTablet}>
              {t("loyaltyProgramMenu.LoyaltyCreditNotesTable.creditNoteEndDate")}
            </th>
            <th>{t("loyaltyProgramMenu.LoyaltyCreditNotesTable.activateCreditNote")}</th>
            <th>{t("loyaltyProgramMenu.LoyaltyCreditNotesTable.creditNoteAmount")}</th>
          </tr>
          {isNotNullNorUndefined(availableCreditNotes) &&
            isNonEmptyArray(availableCreditNotes["hydra:member"]) &&
            availableCreditNotes["hydra:member"].map(creditNote => {
              const checkoutCompletedAt = creditNote.generatedByOrder?.checkoutCompletedAt;

              return (
                <tr key={creditNote["@id"]}>
                  <td>{creditNote.generatedByOrder?.number}</td>
                  <td className={styles.dontShowOnMobileOrTablet}>
                    {isNotNullNorUndefined(checkoutCompletedAt) &&
                      new Date(checkoutCompletedAt).toLocaleDateString(lang)}
                  </td>
                  <td className={styles.dontShowOnMobileOrTablet}>
                    {isNotNullNorUndefined(creditNote.type) &&
                      t(`loyaltyProgramMenu.LoyaltyCreditNotesTable.${creditNote.type}`)}
                  </td>
                  <td className={styles.dontShowOnMobileOrTablet}>
                    {isNotNullNorUndefined(creditNote.endDate) &&
                      new Date(creditNote.endDate).toLocaleDateString(lang)}
                  </td>
                  <td>
                    <Button
                      variant="primaryGolden"
                      disabled={isNotNullNorUndefined(creditNote.enabledAt)}
                      onClick={() => activateCreditNote(creditNote.id ?? 0)}
                      isLoading={isLoading}
                    >
                      {t("loyaltyProgramMenu.LoyaltyCreditNotesTable.activateButton")}
                    </Button>
                  </td>
                  <td>
                    <Price price={creditNote.amount ?? 0} size="small" />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className={styles.showAllContainer}>
        <Button
          variant="secondaryWhite"
          onClick={() => setShowAll(!showAll)}
          isLoading={isFetchingCreditNotes}
        >
          {showAll
            ? t("loyaltyProgramMenu.LoyaltyCreditNotesTable.showLessButton")
            : t("loyaltyProgramMenu.LoyaltyCreditNotesTable.showAllButton")}
        </Button>
      </div>
      {isError && <p>{t("common:common.errorOccurred")} </p>}
    </div>
  );
};

export default LoyaltyCreditNotesSection;
