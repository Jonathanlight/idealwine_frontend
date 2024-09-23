import clsx from "clsx";
import Image from "next/image";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { EstateJsonldShopEstateRead } from "@/networking/sylius-api-client/.ts.schemas";
import { generateUrl } from "@/urls/linksTranslation";
import { dynamicMenuLinks, isBio, isMustHaveLink, MenuItem } from "@/utils/dynamicMenuConstants";
import { useTranslation } from "@/utils/next-utils";

import styles from "./MenuItemList.module.scss";

type Props = {
  closeNavigationMenu: () => void;
  columnData: MenuItem[];
  weeklyEstates?: EstateJsonldShopEstateRead[];
  trailingElements?: React.ReactNode;
};

const MenuItemList = ({
  closeNavigationMenu,
  columnData,
  weeklyEstates,
  trailingElements,
}: Props) => {
  const { t, lang } = useTranslation("common");

  return (
    <div className={styles.mainContainer}>
      {columnData.map((item, index) => (
        <ul key={index} className={styles.listContainer}>
          <li className={styles.title}>
            {item.label === "allOurWinesOnSale" ? (
              <TranslatableLink
                href={getPlpUrl(dynamicMenuLinks[item.label].params, lang)}
                className={styles.link}
                onClick={closeNavigationMenu}
                dontTranslate
              >
                <strong>{t(`header.dynamicMenu.${item.label}`)}</strong>
              </TranslatableLink>
            ) : item.label === "spirits" ? (
              <TranslatableLink
                href={getPlpUrl(dynamicMenuLinks[item.label].params, lang)}
                className={styles.link}
                onClick={closeNavigationMenu}
                dontTranslate
              >
                <strong>{t(`header.dynamicMenu.${item.label}`)}</strong>
              </TranslatableLink>
            ) : (
              <strong>{t(`header.dynamicMenu.${item.label}`)}</strong>
            )}
          </li>
          <ul className={styles.list}>
            {item.items?.map((subItem, subIndex) => {
              const subLabel = subItem.label;
              if (!(subLabel in dynamicMenuLinks)) {
                return <>⚠️ Missing link for {subLabel} in dynamicMenuLinks</>;
              }
              const typedSubLabel = subLabel as keyof typeof dynamicMenuLinks;

              return (
                <li key={subIndex}>
                  {typedSubLabel === "primeurs" ? (
                    <TranslatableLink
                      href={generateUrl("PRIMEURS_URL", lang)}
                      className={styles.link}
                      onClick={closeNavigationMenu}
                      dontTranslate
                    >
                      {t(`header.dynamicMenu.${subLabel}`)}
                    </TranslatableLink>
                  ) : typedSubLabel === "tripleAWines" ? (
                    <TranslatableLink
                      href={generateUrl("TRIPLE_A_WINES", lang)}
                      className={styles.link}
                      onClick={closeNavigationMenu}
                      dontTranslate
                    >
                      {t(`header.dynamicMenu.${subLabel}`)}
                    </TranslatableLink>
                  ) : (
                    <TranslatableLink
                      href={getPlpUrl(dynamicMenuLinks[typedSubLabel].params, lang)}
                      className={clsx(
                        isMustHaveLink(subLabel),
                        isBio(subLabel) && styles.bioLink,
                        styles.link,
                      )}
                      onClick={closeNavigationMenu}
                      dontTranslate
                    >
                      {t(`header.dynamicMenu.${subLabel}`)}
                      {isBio(subLabel) && (
                        <Image
                          src="/bioWineDynamicMenuIcon.png"
                          alt="bio"
                          width={16}
                          height={16}
                          className={styles.bioIcon}
                        />
                      )}
                    </TranslatableLink>
                  )}
                </li>
              );
            })}
            {weeklyEstates?.map(estate => (
              <li key={estate.name}>
                <TranslatableLink
                  href={getPlpUrl({ domainName: [estate.name] }, lang)}
                  className={styles.link}
                  onClick={closeNavigationMenu}
                  dontTranslate
                >
                  {t("header.dynamicMenu.weeklyEstatePrefix")}
                  {estate.name}
                </TranslatableLink>
              </li>
            ))}
            {trailingElements}
          </ul>
        </ul>
      ))}
    </div>
  );
};

export default MenuItemList;
