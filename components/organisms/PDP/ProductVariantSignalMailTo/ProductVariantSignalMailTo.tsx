import clsx from "clsx";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { getVariantVintageTitle } from "@/domain/productVariant";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { buildPdpUrl } from "@/utils/getPdpUrl";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ProductVariantSignalMailTo.module.scss";

const emailEquipeVendeursIdw = process.env.NEXT_PUBLIC_EMAIL_SALES_TEAM_IDW ?? "";

export const ProductVariantSignalMailTo = ({
  productVariant,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
}): JSX.Element => {
  const { t, lang } = useTranslation();

  const subject = encodeURIComponent(
    t(`acheter-vin:signalVariantMailTo.mail.subject`, {
      productVariantCode: productVariant.code,
      productVariantName: getVariantVintageTitle(productVariant),
    }),
  );

  const productVariantURL = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}${
    buildPdpUrl(productVariant, t, lang).url
  }`;

  const body = encodeURIComponent(
    t(`acheter-vin:signalVariantMailTo.mail.body`, {
      productVariantURL: productVariantURL,
    }),
  );

  const mailTo = `mailto:${emailEquipeVendeursIdw}?subject=${subject}&body=${body}`;

  return (
    <div>
      {t(`acheter-vin:signalVariantMailTo.signalVariant`)}
      <TranslatableLink href={mailTo} className={clsx(styles.link)} dontTranslate>
        {t(`acheter-vin:signalVariantMailTo.signalVariantLink`)}
      </TranslatableLink>
    </div>
  );
};

export default ProductVariantSignalMailTo;
