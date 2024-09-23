import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useTranslation } from "@/utils/next-utils";

import styles from "./SimilarWinesButton.module.scss";

type Props = {
  region?: string;
  appellation?: string;
  owner?: string;
  text: string;
  className?: string;
  onClick?: () => void;
  url?: string;
};

export const useSimilarProductVariantsUrl = (
  region?: string,
  appellation?: string | null,
  owner?: string | null,
): string | null => {
  const { lang } = useTranslation();

  if (owner != null) {
    return getPlpUrl({ ownerName: [owner] }, lang);
  }
  if (appellation != null) {
    return getPlpUrl({ subregion: [appellation] }, lang);
  }
  if (region != null) {
    return getPlpUrl({ region: [region] }, lang);
  }

  return null;
};

const SimilarWinesButton = ({
  text,
  region,
  appellation,
  owner,
  className,
  onClick,
  url,
}: Props) => {
  const { lang } = useTranslation();

  const params = {
    ...(region !== undefined && { region: [region] }),
    ...(appellation !== undefined && { subregion: [appellation] }),
    ...(owner !== undefined && { ownerName: [owner] }),
  };

  return (
    <TranslatableLink href={url ?? getPlpUrl(params, lang)} className={styles.link} dontTranslate>
      <Button variant="primaryBlack" className={className} onClick={onClick}>
        {text}
      </Button>
    </TranslatableLink>
  );
};

export default SimilarWinesButton;
