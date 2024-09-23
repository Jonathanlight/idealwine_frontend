import { ProductVariantJsonldShopProductVariantReadFormat } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

type Props = {
  variant: {
    format?: ProductVariantJsonldShopProductVariantReadFormat;
    numberOfBottles?: number;
  };
};

const NumberOfBottlesWithFormat = ({ variant }: Props): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <>
      {t(`enum.format.${variant.format ?? "INCONNU"}`, {
        count: variant.numberOfBottles,
      })}
    </>
  );
};

export default NumberOfBottlesWithFormat;
