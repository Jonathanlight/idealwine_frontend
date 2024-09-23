import { sendGTMEvent } from "@next/third-parties/google";
import { useEffect } from "react";

import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram } from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import {
  useShopGetCustomerItem,
  useShopGetDatalayerCustomerItem,
} from "@/networking/sylius-api-client/customer/customer";
import { device } from "@/styles/breakpoints";
import { PAYMENT_METHOD_CODES, STALE_TIME_HOUR } from "@/utils/constants";
import { syliusLocaleToNextLang } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

const useDataLayer = () => {
  const { lang } = useTranslation();

  useEffect(() => {
    sendGTMEvent({ siteLangue: lang, device });
  }, [lang]);

  const { user, cart } = useAuthenticatedUserContext();
  const { data: customer, isFetching } = useShopGetCustomerItem(user?.customerId ?? "");
  const { data: enabledCountries } = useShopGetCountryCollection(
    { enabled: true },
    { query: { staleTime: STALE_TIME_HOUR } },
  );

  const { data: customerMetadata } = useShopGetDatalayerCustomerItem(user?.customerId ?? "");

  const customerCountryName = enabledCountries?.find(
    country => country.code === customer?.defaultAddress?.countryCode,
  )?.name;
  const lastLogin = customer?.user?.lastLogin;
  const isLoggedIn = user === null ? undefined : user === undefined ? "N" : "O";
  const customerLocaleCode = customer?.localeCode;

  useEffect(() => {
    if (isLoggedIn === undefined || isFetching) return;

    sendGTMEvent({
      "Date-creation":
        customer?.createdAt !== undefined
          ? new Date(customer.createdAt).toLocaleDateString("fr-FR")
          : undefined,
      CP: customer?.defaultAddress?.postcode,
      Civ: customer?.gender === "m" ? "Monsieur" : customer?.gender === "f" ? "Madame" : undefined,
      Prenom: customer?.firstName,
      Nom: customer?.lastName,
      LangueProfil: isNotNullNorUndefined(customerLocaleCode)
        ? syliusLocaleToNextLang(customerLocaleCode)
        : undefined,
      Ville: customer?.defaultAddress?.city,
      Pays: customerCountryName,
      MP: customerMetadata?.isAutomaticallyBlocked,
      DateN: customer?.birthday?.split("T").join(" ").split("Z")[0],
      "Type-paiement":
        customer?.paymentMethod?.code === PAYMENT_METHOD_CODES.CREDIT_CARD
          ? "CB"
          : customer?.paymentMethod?.code === PAYMENT_METHOD_CODES.BANK_TRANSFER
          ? "Virement"
          : undefined,
      PaiementOK:
        customer?.customerPaymentMethodValid === true
          ? "O"
          : customer?.customerPaymentMethodValid === false
          ? "N"
          : undefined,
      "Date-login": isNotNullNorUndefined(lastLogin)
        ? new Date(lastLogin).toLocaleDateString("fr-FR")
        : undefined,
      "Date-cmd": customerMetadata?.dateCde,
      "Part-VAD": customerMetadata?.partVad?.toFixed(2),
      "Part-VE": customerMetadata?.partVe?.toFixed(2),
      "Part-VAD-365": customerMetadata?.partVad365?.toFixed(2),
      "Part-VE-365": customerMetadata?.partVe365?.toFixed(2),
      totallot: customerMetadata?.totalLot,
      pbordeaux: customerMetadata?.pourcentBordeaux,
      pbourgogne: customerMetadata?.pourcentBourgogne,
      pchampagne: customerMetadata?.pourcentChampagne,
      prhone: customerMetadata?.pourcentRhone,
      pautre: customerMetadata?.pourcentAutre,
      pmature: customerMetadata?.pourcentMature,
      pnature: customerMetadata?.pourcentNature,
      regionpref: customerMetadata?.regionPref1,
      regionpref2: customerMetadata?.regionPref2,
      prixmoycol: customerMetadata?.prixMoyenCol?.toFixed(2),
      nbpanier: cart?.items?.length,
      vendeur: customer?.canSell === true ? "O" : customer?.canSell === false ? "N" : undefined,
      genre:
        customer?.proClient === true
          ? "Professionnel"
          : customer?.proClient === false
          ? "Particulier"
          : undefined,
      CATopriv: customerMetadata?.caToPriv335?.toFixed(2),
      CAToclub: customerMetadata?.caToClub335?.toFixed(2),
      CAtoquint: customerMetadata?.caToQuint1795?.toFixed(2),
      MajAuto:
        customer?.loyaltyProgramAutoUpdate === true
          ? "O"
          : customer?.loyaltyProgramAutoUpdate === false
          ? "N"
          : undefined,
      CaGlob: customerMetadata?.caGlobal?.toFixed(2),
      Ca365: customerMetadata?.caJ365?.toFixed(2),
      User_Id: user?.customerId,
      User_Membre:
        customer?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.NONE
          ? "Standard"
          : customer?.loyaltyProgram ===
            CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.PRIVILEGE
          ? "Privilege"
          : customer?.loyaltyProgram === CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.IDEAL
          ? "Ideal"
          : customer?.loyaltyProgram ===
            CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.QUINTESSENCE
          ? "Quintessence"
          : undefined,
      User_Logue: isLoggedIn,
      Email: customer?.email,
      "Opt-in": customer?.subscribedToNewsletter ? "Oui" : undefined,
    });
  }, [
    cart?.items?.length,
    customer?.birthday,
    customer?.canSell,
    customer?.createdAt,
    customer?.defaultAddress?.city,
    customer?.defaultAddress?.postcode,
    customer?.email,
    customer?.firstName,
    customer?.gender,
    customer?.customerPaymentMethodValid,
    customer?.lastName,
    customer?.loyaltyProgram,
    customer?.loyaltyProgramAutoUpdate,
    customer?.paymentMethod?.code,
    customer?.proClient,
    customer?.subscribedToNewsletter,
    customerCountryName,
    isLoggedIn,
    lastLogin,
    user?.customerId,
    isFetching,
    customerMetadata,
    customerLocaleCode,
  ]);
};

export const DataLayer = () => {
  useDataLayer();

  return null;
};
