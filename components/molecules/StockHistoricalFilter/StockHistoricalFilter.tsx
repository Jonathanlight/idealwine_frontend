import Select from "@/components/atoms/Select";
import {
  ProductVariantStatus,
  statuses,
} from "@/components/organisms/ProductVariantsInStock/types";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

export const ALL_FILTERS = "allFilters";

import styles from "./StockHistoricalFilter.module.scss";

type Props = {
  setStatus?: (status: ProductVariantStatus[]) => void;
  status?: ProductVariantStatus[];
};

const StockHistoricalFilter = ({ status, setStatus }: Props) => {
  const { t } = useTranslation("lots-en-stock");

  const filters: (ProductVariantStatus | typeof ALL_FILTERS)[] = [ALL_FILTERS, ...statuses];

  return (
    <div className={styles.filter}>
      <p>{t("filterBy")}</p>
      <Select
        showRequiredStar
        placeholder={t("productStatus.placeholder")}
        defaultValue={
          isNotNullNorUndefined(status) && status !== statuses ? status[0] : ALL_FILTERS
        }
        options={{
          groups: [
            {
              key: t("productStatus.groupTitle"),
              title: t("productStatus.groupTitle"),
              options: filters.map(stat => ({
                value: stat,
                label: t(`productStatus.${stat}`),
              })),
            },
          ],
        }}
        onValueChange={(value: ProductVariantStatus | typeof ALL_FILTERS) => {
          if (!setStatus) return;
          if (value === ALL_FILTERS) {
            setStatus(statuses);
          } else {
            setStatus([value]);
          }
        }}
      />
    </div>
  );
};

export default StockHistoricalFilter;
