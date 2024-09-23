// eslint-disable-next-line no-restricted-imports
import Link from "next/link";

import { buildPdpUrl, PdpLinkVariant } from "@/utils/getPdpUrl";
import { useTranslation } from "@/utils/next-utils";

export type PdpLinkProps = {
  variant: PdpLinkVariant;
  children?: React.ReactNode;
  fromPLP?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href">;

const PdpLink = ({ variant, children, fromPLP = false, ...props }: PdpLinkProps): JSX.Element => {
  const { t, lang } = useTranslation("common");

  const href = buildPdpUrl(variant, t, lang).url;

  const fullPathObject = {
    pathname: href,
    ...(fromPLP ? { query: { fromPLP: true } } : {}),
  };

  return (
    <Link {...props} href={fullPathObject} as={href}>
      {children ?? "link"}
    </Link>
  );
};

export default PdpLink;
