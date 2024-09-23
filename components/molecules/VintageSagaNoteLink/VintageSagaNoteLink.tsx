import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { linkMapping } from "@/hooks/useVintageSagaNotes";
import {
  VintageSagaJsonldShopVintageSagaPlpReadRegion,
  VintageSagaJsonldShopVintageSagaTableReadRegion,
} from "@/networking/sylius-api-client/.ts.schemas";
import { Locale } from "@/urls/linksTranslation";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

type Props = {
  regionName:
    | VintageSagaJsonldShopVintageSagaPlpReadRegion
    | VintageSagaJsonldShopVintageSagaTableReadRegion;
  year: number;
  rating: number | undefined;
  lang: Locale;
  className?: string;
};

const VintageSagaNoteLink = ({ regionName, year, rating, lang, className }: Props) => {
  return (
    <TranslatableLink
      href={getPlpUrl(
        {
          [linkMapping[regionName].key]: [linkMapping[regionName].value],
          vintage: [year],
        },
        lang,
      )}
      dontTranslate
    >
      {isNotNullNorUndefined(rating) && (
        <span className={className}>
          <strong>{rating}</strong>
          {"/20"}
        </span>
      )}
    </TranslatableLink>
  );
};

export default VintageSagaNoteLink;
