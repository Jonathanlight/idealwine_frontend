import clsx from "clsx";

import { useVintageSagaNotes } from "@/hooks/useVintageSagaNotes";
import { useTranslation } from "@/utils/next-utils";

import { VintageNotesTableProps } from "../VintageNotesTable/VintageNotesTable";
import VintageSagaCard from "./VintageSagaCard/VintageSagaCard";
import styles from "./index.module.scss";

const MobileVintageSagaDeck = ({ vintageSagaData, variant }: VintageNotesTableProps) => {
  const { t } = useTranslation("saga-millesime");
  const { vintageSagas } = useVintageSagaNotes(vintageSagaData, variant, "YEAR", "DESC");

  return (
    <div className={clsx(styles.sagaCards, styles.dontShowOnTabletOrDesktop)}>
      {vintageSagas.map((vintageSaga, index) => {
        return <VintageSagaCard key={index} saga={vintageSaga} />;
      })}
      <p>{t("footNote")}</p>
    </div>
  );
};

export default MobileVintageSagaDeck;
