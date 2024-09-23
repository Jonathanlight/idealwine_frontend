import { IncomingMessage } from "http";
// eslint-disable-next-line no-restricted-imports
import useTranslationBase from "next-translate/useTranslation";

import { defaultLocale, Locale } from "@/urls/linksTranslation";

export const getAbsoluteUrl = (req: IncomingMessage) => {
  const protocol =
    req.headers.referer?.split("://")[0] ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  return `${protocol}://${req.headers.host ?? ""}${req.url ?? ""}`;
};

export const useTranslation = (defaultNS?: string) => {
  const result = useTranslationBase(defaultNS);

  const lang = result.lang === "default" ? defaultLocale : result.lang;

  return { ...result, lang: lang as Locale };
};
