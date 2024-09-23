import { format } from "date-fns";

import CustomColorCircleIcon from "@/components/atoms/CustomColorCircleIcon/CustomColorCircleIcon";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useGetCurrentAuctionCatalogs } from "@/hooks/useGetCurrentAuctionCatalogs";
import { AVAILABLE_LOCALES } from "@/utils/datesHandler";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./AllOurAuctions.module.scss";

type Props = {
  closeNavigationMenu: () => void;
  isActive: boolean;
};

const AuctionItemList = ({ closeNavigationMenu, isActive }: Props) => {
  const { t, lang } = useTranslation("common");
  const validatedAuctionCatalogs = useGetCurrentAuctionCatalogs(lang, isActive);

  if (!validatedAuctionCatalogs) return <></>;

  const groupedAuctionCatalogs = Object.entries(validatedAuctionCatalogs);

  return (
    <ul className={styles.listContainer}>
      <li className={styles.title}>
        <strong>{t(`header.dynamicMenu.AllOurAuctions`)}</strong>
      </li>
      <ul className={styles.listContainernoborder}>
        {groupedAuctionCatalogs.map(([endDate, catalogs]) => {
          const auctionCatalogEndDate = format(new Date(endDate), "dd MMMM yyyy", {
            locale: AVAILABLE_LOCALES[lang],
          });

          return (
            <ul key={endDate}>
              <li className={styles.titleEndDate}>
                {t(`header.dynamicMenu.saleUntil`, { endDate: auctionCatalogEndDate })}
              </li>
              {catalogs.map(catalog => {
                const catalogId = catalog.id;
                const params = isNotNullNorUndefined(catalogId)
                  ? { auctionCatalogId: [`${catalog.id ?? ""}`] }
                  : {};
                const auctionCatalogEndHour = isNotNullNorUndefined(catalog.endDate)
                  ? format(new Date(catalog.endDate), "HH:mm")
                  : "00:00";

                return (
                  <li key={catalog.name}>
                    <TranslatableLink
                      href={getPlpUrl(params, lang)}
                      className={styles.link}
                      onClick={closeNavigationMenu}
                      dontTranslate
                    >
                      <span className={styles.infoContainer}>
                        {auctionCatalogEndHour} |
                        <CustomColorCircleIcon colorVariant={catalog.color} />
                        {catalog.name}
                      </span>
                    </TranslatableLink>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </ul>
    </ul>
  );
};

export default AuctionItemList;
