import Image from "next/image";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { dynamicMenuData, dynamicMenuLinks } from "@/utils/dynamicMenuConstants";
import { useTranslation } from "@/utils/next-utils";

import styles from "./WinesByApellationSubMenu.module.scss";

type Props = {
  closeNavigationMenu: () => void;
};

const WinesByApellationSubMenu = ({ closeNavigationMenu }: Props) => {
  const { t, lang } = useTranslation("common");
  const imageSize = 75;

  const winesByRegionData = dynamicMenuData[1].items?.slice(2) ?? [];

  return (
    <div className={styles.root}>
      {winesByRegionData.map(item => {
        const label = item.label;
        if (!(label in dynamicMenuLinks)) {
          return <>⚠️ Missing link for {label} in dynamicMenuLinks</>;
        }
        const typedLabel = label as keyof typeof dynamicMenuLinks;

        return (
          <div key={label} className={styles.subRegionContainer}>
            <Image
              src={`/winesByRegionMenu/${label}.jpg`}
              alt="bio"
              width={imageSize}
              height={imageSize}
              className={styles.image}
            />
            <div className={styles.apellations}>
              <TranslatableLink
                href={getPlpUrl(dynamicMenuLinks[typedLabel].params, lang)}
                className={styles.linkTitle}
                onClick={closeNavigationMenu}
                dontTranslate
              >
                <strong>{t(`header.dynamicMenu.${label}`)}</strong>
              </TranslatableLink>
              <div />
              <div className={styles.appellationContainer}>
                {item.items?.map(subItem => {
                  const subLabel = subItem.label;
                  if (!(subLabel in dynamicMenuLinks)) {
                    return <>⚠️ Missing link for {subLabel} in dynamicMenuLinks</>;
                  }
                  const typedSubLabel = subLabel as keyof typeof dynamicMenuLinks;

                  return (
                    <TranslatableLink
                      href={getPlpUrl(dynamicMenuLinks[typedSubLabel].params, lang)}
                      className={styles.appellationLink}
                      key={subLabel}
                      onClick={closeNavigationMenu}
                      dontTranslate
                    >
                      {t(`header.dynamicMenu.${subLabel}`)}
                    </TranslatableLink>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WinesByApellationSubMenu;
