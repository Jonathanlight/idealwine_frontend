import { CaretRightIcon } from "@radix-ui/react-icons";
import React from "react";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ProductListButton.module.scss";
type Props = {
  closeNavigationMenu: () => void;
  showAuctions?: boolean;
};

const ProductListButton = ({ closeNavigationMenu, showAuctions = false }: Props) => {
  const { t, lang } = useTranslation("common");

  return (
    <TranslatableLink
      href={getPlpUrl(showAuctions ? { isDirectPurchase: ["false"] } : {}, lang)}
      className={styles.link}
      onClick={closeNavigationMenu}
      dontTranslate
    >
      <strong>
        {t(`header.dynamicMenu.${showAuctions ? "seeAllOurAuctions" : "seeAllOurWines"}`)}
      </strong>
      <CaretRightIcon aria-hidden className={styles.caretRight} />
    </TranslatableLink>
  );
};

export default ProductListButton;
