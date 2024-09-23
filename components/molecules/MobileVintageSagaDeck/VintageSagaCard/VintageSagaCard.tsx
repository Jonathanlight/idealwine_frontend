import { VintageSagaNotes } from "@/hooks/useVintageSagaNotes";
import { useTranslation } from "@/utils/next-utils";

import VintageSagaNoteLink from "../../VintageSagaNoteLink";
import styles from "./index.module.scss";

type Props = {
  saga: VintageSagaNotes;
};

const VintageSagaCard = ({ saga }: Props) => {
  const { t, lang } = useTranslation("saga-millesime");

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <p>{t("year")}</p>
        <p>{saga.year}</p>
      </div>
      {saga.notes.map((vintageSagaNote, index) => {
        return (
          <div key={index} className={styles.vintageSagaNote}>
            <p>{t(`enums:region.${vintageSagaNote.regionName}`)}</p>
            <VintageSagaNoteLink
              regionName={vintageSagaNote.regionName}
              year={vintageSagaNote.year}
              rating={vintageSagaNote.rating}
              lang={lang}
              className={styles.rating}
            />
          </div>
        );
      })}
    </div>
  );
};
export default VintageSagaCard;
