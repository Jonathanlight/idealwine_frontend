import { BaseHit, Hit } from "instantsearch.js";
import { Highlight } from "react-instantsearch-hooks-web";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { generateRatingUrlUtils } from "@/utils/generateRatingUrlUtils";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";

import styles from "./VintageRatingAlgoliaHit.module.scss";

type Props = {
  hit: Hit<BaseHit>;
};

const VintageRatingAlgoliaHit =
  ({ onClick }: { onClick: () => void }) =>
  // eslint-disable-next-line react/display-name
  ({ hit }: Props): JSX.Element => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t, lang } = useTranslation();

    const regionName =
      typeof hit.regionName === "string" ? t(`enums:region.${hit.regionName}`) : "";
    const productAppellation = hit.productAppellation;
    const estateName = hit.estateName;
    const productVintageCode = hit.mostRecentProductVintageCode;
    const format = t("enums:formatWithoutCount.BOUTEILLE");
    const color = typeof hit.color === "string" ? t(`enums:color.${hit.color}`).toLowerCase() : "";
    const langEnum = nextLangToSyliusLocale(lang);
    const { completeUrl } = generateRatingUrlUtils(
      productVintageCode as string,
      format,
      regionName,
      productAppellation?.toString() ?? "",
      estateName?.toString() ?? "",
      color,
      lang,
    );

    return (
      <TranslatableLink onClick={onClick} href={completeUrl} dontTranslate className={styles.hit}>
        <Highlight
          attribute={`name.${langEnum}`}
          hit={hit}
          classNames={{ highlighted: styles.highlight }}
        />
      </TranslatableLink>
    );
  };

export default VintageRatingAlgoliaHit;
