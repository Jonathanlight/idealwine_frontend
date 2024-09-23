import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { EstateEstateNamesDtoJsonld } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import styles from "./EstateBox.module.scss";

const EstateBox = ({
  estate,
  estateQuery,
}: {
  estate: EstateEstateNamesDtoJsonld;
  estateQuery: string;
}) => {
  const { lang } = useTranslation();

  const getHighlightedText = (text: string, query: string) => {
    const textParts = text.split(new RegExp(`(${query})`, "gi"));

    return (
      <span>
        {textParts.map((textPart, i) =>
          textPart.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className={styles.textHighlight}>
              {textPart}
            </mark>
          ) : (
            textPart
          ),
        )}
      </span>
    );
  };

  return (
    <TranslatableLink
      href={getPlpUrl({ domainName: [estate.name] }, lang)}
      className={styles.estateBoxContainer}
      dontTranslate
    >
      {getHighlightedText(estate.name ?? "Missing estate name", estateQuery)}
    </TranslatableLink>
  );
};

export default EstateBox;
