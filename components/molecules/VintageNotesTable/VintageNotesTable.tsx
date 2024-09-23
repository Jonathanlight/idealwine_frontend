import { faSquare } from "@fortawesome/pro-light-svg-icons/faSquare";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { SortCriteria, useVintageSagaNotes } from "@/hooks/useVintageSagaNotes";
import { VintageSagaJsonldShopVintageSagaTableRead } from "@/networking/sylius-api-client/.ts.schemas";
import { buildRatingRakingUrl } from "@/utils/getRatingRakingUrl";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import VintageSagaNoteLink from "../VintageSagaNoteLink";
import styles from "./index.module.scss";

export type VintageNotesTableProps = {
  vintageSagaData: VintageSagaJsonldShopVintageSagaTableRead[];
  variant: "countries" | "frenchRegions";
};

const VintageNotesTable = ({ vintageSagaData, variant }: VintageNotesTableProps) => {
  const { t, lang } = useTranslation("saga-millesime");
  const [sort, setSort] = useState<SortCriteria>({ column: "YEAR", direction: "DESC" });

  const { vintageSagas, tableColumns, vintageSagaRegions } = useVintageSagaNotes(
    vintageSagaData,
    variant,
    sort.column,
    sort.direction,
  );

  const sortVintageSagasByColumn = (keyColumn: string) => {
    if (sort.column === keyColumn) {
      setSort({ column: keyColumn, direction: sort.direction === "ASC" ? "DESC" : "ASC" });
    } else {
      setSort({ column: keyColumn, direction: "ASC" });
    }
  };

  return (
    <div className={styles.dontShowOnMobile}>
      <table className={styles.table}>
        <thead>
          <tr>
            {tableColumns.map(column => {
              const iconColor =
                column.color === "red"
                  ? styles.red
                  : column.color === "liquourousWhite"
                  ? styles.liquorousWhite
                  : styles.white;
              const icon = <FontAwesomeIcon className={iconColor} icon={faSquare} />;

              return (
                <th key={column.key} className={styles.tableTitle}>
                  <Button
                    variant="inline"
                    onClick={() => sortVintageSagasByColumn(column.key)}
                    className={styles.link}
                  >
                    {isNotNullNorUndefined(column.color) && column.key !== "YEAR" ? (
                      <span>
                        {t(`enums:region.${column.name}`)} {icon}
                      </span>
                    ) : (
                      <span>
                        {t(column.key === "YEAR" ? column.name : `enums:region.${column.name}`)}
                      </span>
                    )}
                  </Button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {vintageSagas.map(vintageSaga => (
            <tr key={vintageSaga.year}>
              <td className={styles.vintageYear}>
                <TranslatableLink
                  href={buildRatingRakingUrl(lang, vintageSaga.year)}
                  dontTranslate
                  className={styles.link}
                >
                  {vintageSaga.year}
                </TranslatableLink>
              </td>
              {vintageSagaRegions.map(column => (
                <td key={column.key}>
                  {vintageSaga.notes.map(saga => (
                    <Fragment key={saga.key}>
                      {saga.key === column.key && (
                        <VintageSagaNoteLink
                          regionName={saga.regionName}
                          year={saga.year}
                          rating={saga.rating}
                          lang={lang}
                        />
                      )}
                    </Fragment>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.footNote}>{t("footNote")}</p>
    </div>
  );
};

export default VintageNotesTable;
