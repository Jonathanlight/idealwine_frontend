// eslint-disable-next-line no-restricted-imports

import { dynamicMenuData } from "@/utils/dynamicMenuConstants";

import MenuItemList from "../MenuItemList/MenuItemList";
import WinesByApellationSubMenu from "./WinesByApellationSubMenu/WinesByApellationSubMenu";
import styles from "./WinesByRegionMenu.module.scss";

type Props = {
  closeNavigationMenu: () => void;
};

const WinesByRegionMenu = ({ closeNavigationMenu }: Props) => {
  const winesByRegionSection = dynamicMenuData[1].items ?? [];
  const winesByRegionData = winesByRegionSection.slice(0, 1);
  const winesByCountryData = winesByRegionSection.slice(1, 2);

  return (
    <div className={styles.root}>
      <MenuItemList columnData={winesByRegionData} closeNavigationMenu={closeNavigationMenu} />
      <MenuItemList columnData={winesByCountryData} closeNavigationMenu={closeNavigationMenu} />
      <WinesByApellationSubMenu closeNavigationMenu={closeNavigationMenu} />
    </div>
  );
};

export default WinesByRegionMenu;
