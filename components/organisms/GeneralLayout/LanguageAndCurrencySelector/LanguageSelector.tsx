import Image from "next/image";
import { useRouter } from "next/router";
import { Dispatch, memo, SetStateAction, useMemo } from "react";
import { toast } from "react-toastify";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useShopPutCustomerItem } from "@/networking/sylius-api-client/customer/customer";
import { HrefLangs } from "@/types/HrefLangs";
import { generateTranslatedUrlRedirectionPerLocale, LOCALES } from "@/urls/linksTranslation";
import { generateTranslatedUrlWithBothData } from "@/utils/generateTranslatedUrlWithBothData";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { isNullOrUndefined } from "@/utils/ts-utils";

import styles from "./LanguageSelector.module.scss";

type LanguageSelectorProps = {
  isOnPLP: boolean;
  hrefLangs?: HrefLangs;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const LanguageSelector = ({ isOnPLP, hrefLangs, setOpen }: LanguageSelectorProps) => {
  const { t, lang } = useTranslation("common");
  const { asPath } = useRouter();
  const { user } = useAuthenticatedUserContext();
  const translatedUrlRewrite = useMemo(() => generateTranslatedUrlRedirectionPerLocale(), []);
  const dynamicTranslatedUrlRewrite = useMemo(
    () => generateTranslatedUrlRedirectionPerLocale(true),
    [],
  );
  const { mutateAsync: putCustomer } = useShopPutCustomerItem();

  return (
    <div className={styles.dropdownMenuLanguages}>
      {LOCALES.map(locale => {
        const urlQueryParams = asPath.split("?")[1];

        return (
          <LinkButton
            variant="inline"
            href={generateTranslatedUrlWithBothData(
              translatedUrlRewrite,
              dynamicTranslatedUrlRewrite,
              isOnPLP,
              {
                pathname: asPath.split("?")[0],
                search: isNullOrUndefined(urlQueryParams) ? "" : `?${urlQueryParams}`,
              },
              hrefLangs,
            )(asPath, locale, lang)}
            locale={locale}
            key={locale}
            dontTranslate
            onClick={async () => {
              setOpen(false);
              if (user) {
                try {
                  await putCustomer({
                    id: user.customerId,
                    data: { localeCode: nextLangToSyliusLocale(locale) },
                  });
                  toast.success<string>(t("header.languageSelector.languageUpdated"));
                } catch (err) {
                  toast.error<string>(t("header.languageSelector.errorUpdatingLanguage"));
                }
              }
            }}
          >
            <Image
              src={`/flags/${locale}.svg`}
              alt={locale}
              width={25}
              height={25}
              className={styles.languageLogo}
            />
          </LinkButton>
        );
      })}
    </div>
  );
};

export default memo(LanguageSelector);
