import { PrismicLink } from "@prismicio/react";
import { CaretDownIcon } from "@radix-ui/react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import { useState } from "react";
import { RemoveScroll } from "react-remove-scroll";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { dynamicMenuLinks } from "@/utils/dynamicMenuConstants";
import { CommonPageProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import AllOurAuctions from "./AllOurAuctions/AllOurAuctions";
import AllOurWines from "./AllOurWines";
import styles from "./DesktopDynamicMenu.module.scss";
import ServicesMenuPanel from "./ServicesMenuPanel/ServicesMenuPanel";
import WinesByRegionMenu from "./WinesByRegionMenu/WinesByRegionMenu";

type Props = {
  className?: string;
} & Pick<CommonPageProps, "dynamicMenuTab" | "pageDynamicMenuPromotionBanner">;

const DesktopDynamicMenu = ({
  className,
  dynamicMenuTab,
  pageDynamicMenuPromotionBanner,
}: Props) => {
  const [activeItem, setActiveItem] = useState("");
  const isOverlayVisible = activeItem !== "";

  const { t, lang } = useTranslation("common");

  const closeNavigationMenu = () => {
    setActiveItem("");
  };

  const dropdownData = [
    {
      label: t("header.dynamicMenu.allOurWines"),
      component: (
        <AllOurWines
          closeNavigationMenu={closeNavigationMenu}
          pageDynamicMenuPromotionBanner={pageDynamicMenuPromotionBanner}
          isActive={activeItem === t("header.dynamicMenu.allOurWines")}
        />
      ),
    },
    {
      label: t("header.dynamicMenu.OurWinesByRegion"),
      component: <WinesByRegionMenu closeNavigationMenu={closeNavigationMenu} />,
    },
    {
      label: t("header.dynamicMenu.AllOurAuctions"),
      component: (
        <AllOurAuctions
          closeNavigationMenu={closeNavigationMenu}
          isActive={activeItem === t("header.dynamicMenu.AllOurAuctions")}
        />
      ),
    },
    {
      label: t("header.dynamicMenu.ourServices"),
      component: <ServicesMenuPanel closeNavigationMenu={closeNavigationMenu} />,
    },
  ];

  return (
    <RemoveScroll enabled={isOverlayVisible}>
      <NavigationMenu.Root
        className={clsx(styles.navigationMenuRoot, className)}
        value={activeItem}
        onValueChange={setActiveItem}
      >
        <NavigationMenu.List className={styles.navigationMenuList}>
          {dropdownData.map(data => (
            <NavigationMenu.Item key={data.label} value={data.label}>
              <NavigationMenu.Trigger
                className={clsx(
                  styles.navigationMenuTrigger,
                  data.label === activeItem && styles.goldenBottomBorder,
                )}
                onPointerEnter={e => e.preventDefault()}
                onPointerMove={e => e.preventDefault()}
                onPointerLeave={e => e.preventDefault()}
              >
                {data.label} <CaretDownIcon className={styles.caretDown} aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content
                forceMount
                className={styles.navigationMenuContent}
                style={{
                  display: data.label === activeItem ? "block" : "none",
                }}
              >
                {data.component}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ))}

          <NavigationMenu.Item>
            <TranslatableLink
              href="IM_A_NEWBIE_URL"
              className={clsx(styles.navigationMenuTrigger, styles.link)}
            >
              {t("header.dynamicMenu.HelpMeChoose")}
            </TranslatableLink>
          </NavigationMenu.Item>
          {isNotNullNorUndefined(dynamicMenuTab) && isNotNullNorUndefined(dynamicMenuTab.url) && (
            <NavigationMenu.Item>
              <PrismicLink
                onClick={closeNavigationMenu}
                className={clsx(styles.navigationMenuTrigger, styles.link)}
                field={dynamicMenuTab.url}
              >
                {dynamicMenuTab.label}
              </PrismicLink>
            </NavigationMenu.Item>
          )}
          <NavigationMenu.Item>
            <TranslatableLink
              href={getPlpUrl(dynamicMenuLinks.mustHaves.params, lang)}
              className={clsx(styles.navigationMenuTrigger, styles.link, styles.mustHaves)}
              onClick={closeNavigationMenu}
              dontTranslate
            >
              {t("header.dynamicMenu.mustHaves")}
            </TranslatableLink>
          </NavigationMenu.Item>
          <div />
          <div />
          <div />
        </NavigationMenu.List>
        <div className={styles.viewportPosition}>
          <NavigationMenu.Viewport
            className={styles.navigationMenuViewport}
            onPointerEnter={e => e.preventDefault()}
            onPointerLeave={e => e.preventDefault()}
          />
        </div>
      </NavigationMenu.Root>
      <div className={clsx(styles.overlay, isOverlayVisible && styles.overlayVisible)} />
    </RemoveScroll>
  );
};

export default DesktopDynamicMenu;
