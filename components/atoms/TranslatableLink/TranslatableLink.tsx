// eslint-disable-next-line no-restricted-imports
import Link from "next/link";

import { getTranslatedHref, translatedLinksKeys } from "@/urls/linksTranslation";
import { useTranslation } from "@/utils/next-utils";

export type TranslatableLinkProps = {
  href: translatedLinksKeys | string;
  children?: React.ReactNode;
  dontTranslate?: boolean;
  params?: object;
  queryParam?: URLSearchParams;
} & Omit<React.ComponentProps<typeof Link>, "href">;

const TranslatableLink = ({
  href,
  children,
  dontTranslate = false,
  params,
  queryParam,
  ...props
}: TranslatableLinkProps): JSX.Element => {
  const { lang } = useTranslation();

  const translatedHref = getTranslatedHref(href, lang, dontTranslate, params, queryParam);

  return (
    <Link {...props} href={translatedHref}>
      {children ?? "link"}
    </Link>
  );
};

export default TranslatableLink;
