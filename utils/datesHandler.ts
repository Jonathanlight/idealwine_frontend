import { Locale as dateFnsLocale, formatDuration, intervalToDuration } from "date-fns";
import deLocale from "date-fns/locale/de";
import enLocale from "date-fns/locale/en-GB";
import frLocale from "date-fns/locale/fr";
import itLocale from "date-fns/locale/it";

import { defaultLocale, Locale } from "@/urls/linksTranslation";

export const AVAILABLE_LOCALES: Record<Locale, dateFnsLocale> = {
  fr: frLocale,
  en: enLocale,
  it: itLocale,
  de: deLocale,
};

export const customFormatDuration = ({
  start,
  end,
  lang,
}: {
  start: number;
  end: number;
  lang: Locale;
}): string => {
  const duration = intervalToDuration({ start, end });

  return formatDuration(duration, {
    locale: AVAILABLE_LOCALES[lang],
    format: ["years", "months", "days", "hours", "minutes"],
  });
};

export const addNdays = (date: Date, n: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + n);

  return newDate;
};

export const getDayOfWeek = (date: Date): number => {
  const dayOfWeek = date.getDay();

  return dayOfWeek === 0 ? 7 : dayOfWeek;
};

const optionsForDateWhenSizeNotLong: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const optionsWhenSizeisLong: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

export const transformDateToEuropeanFormat = (dateString: string, size?: string) => {
  const date = new Date(dateString);

  if (size === "long") {
    return date.toLocaleDateString(defaultLocale, optionsWhenSizeisLong);
  }

  return date.toLocaleDateString(defaultLocale, optionsForDateWhenSizeNotLong);
};

export const getFormatDate = (date: string | undefined | null, lang: string): string => {
  const dateObject = new Date(date ?? "");
  const localDate = dateObject.toLocaleDateString(lang);
  const localTime = dateObject.toLocaleTimeString(lang, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${localDate} ${localTime}`;
};

export const getFormatDateWithoutTime = (date: string | undefined | null, lang: string): string => {
  const dateObject = new Date(date ?? "");
  const localDate = dateObject.toLocaleDateString(lang);

  return `${localDate}`;
};
