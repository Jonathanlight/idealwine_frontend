import { dynamicMenuData } from "@/utils/dynamicMenuConstants";

import MenuItemList from "../MenuItemList/MenuItemList";
import ProductListButton from "../ProductListButton";
import styles from "./AllOurAuctions.module.scss";
import AuctionItemList from "./AuctionItemList";
import LastAuctionsPanel from "./LastAuctionsPanel/LastAuctionsPanel";

type Props = {
  className?: string;
  closeNavigationMenu: () => void;
  isActive: boolean;
};

const AllOurAuctions = ({ closeNavigationMenu, isActive }: Props) => {
  const AllOurAuctionsData = dynamicMenuData[2].items ?? [];
  const promotions = AllOurAuctionsData.slice(0, 1);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.root}>
        <MenuItemList columnData={promotions} closeNavigationMenu={closeNavigationMenu} />
        <AuctionItemList isActive={isActive} closeNavigationMenu={closeNavigationMenu} />
        <LastAuctionsPanel isActive={isActive} closeNavigationMenu={closeNavigationMenu} />
      </div>
      <div />
      <ProductListButton closeNavigationMenu={closeNavigationMenu} showAuctions />
    </div>
  );
};

export default AllOurAuctions;
