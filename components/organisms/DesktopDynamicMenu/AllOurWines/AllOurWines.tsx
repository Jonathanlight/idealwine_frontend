import { SliceZone } from "@prismicio/react";

import { AllourwinesmenudesktopDocument } from "@/.slicemachine/prismicio";
import { useGetEstateCollection } from "@/networking/sylius-api-client/estate/estate";
import { components } from "@/slices";
import { STALE_TIME_MINUTE } from "@/utils/constants";
import { dynamicMenuData } from "@/utils/dynamicMenuConstants";
import { useTranslation } from "@/utils/next-utils";

import MenuItemList from "../MenuItemList/MenuItemList";
import ProductListButton from "../ProductListButton";
import styles from "./AllOurWines.module.scss";

type Props = {
  closeNavigationMenu: () => void;
  pageDynamicMenuPromotionBanner: AllourwinesmenudesktopDocument;
  isActive: boolean;
};

const useWeeklyEstates = (isActive: boolean) => {
  const { data: estateCollectionResult } = useGetEstateCollection(
    { weeklyEstate: true },
    { query: { enabled: isActive, staleTime: STALE_TIME_MINUTE } },
  );

  return estateCollectionResult?.["hydra:member"];
};

const allOurWines = dynamicMenuData[0].items ?? [];

const AllOurWines = ({ closeNavigationMenu, pageDynamicMenuPromotionBanner, isActive }: Props) => {
  const { t } = useTranslation("common");

  const weeklyEstates = useWeeklyEstates(isActive);

  const firstColumnData = allOurWines.slice(0, 1);
  const secondColumnData = allOurWines.slice(1, 2);
  const thirdColumnData = allOurWines.slice(2, 3);
  const fourthColumnData = allOurWines.slice(3, 4);
  const fifthColumnData = allOurWines.slice(4, 5);

  const fsaLink = (
    <li key="fsaLink">
      <a
        href={t("header.dynamicMenu.fsaLinkDestination")}
        className={styles.fsaLink}
        target="_blank"
        rel="noreferrer"
      >
        {t("header.dynamicMenu.fsaLink")}
      </a>
    </li>
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.root}>
        <MenuItemList columnData={firstColumnData} closeNavigationMenu={closeNavigationMenu} />
        <MenuItemList columnData={secondColumnData} closeNavigationMenu={closeNavigationMenu} />
        <MenuItemList columnData={thirdColumnData} closeNavigationMenu={closeNavigationMenu} />
        <MenuItemList
          columnData={fourthColumnData}
          closeNavigationMenu={closeNavigationMenu}
          trailingElements={fsaLink}
        />
        <MenuItemList
          columnData={fifthColumnData}
          closeNavigationMenu={closeNavigationMenu}
          weeklyEstates={weeklyEstates}
        />
      </div>
      <SliceZone slices={pageDynamicMenuPromotionBanner.data.slices} components={components} />
      <div />
      <ProductListButton closeNavigationMenu={closeNavigationMenu} />
    </div>
  );
};

export default AllOurWines;
