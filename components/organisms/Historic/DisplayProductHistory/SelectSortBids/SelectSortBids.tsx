import { useState } from "react";

import Select from "@/components/atoms/Select";
import { GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue } from "@/networking/sylius-api-client/.ts.schemas";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

type Props = {
  setSort: (sort: GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue) => void;
  className: string;
};

const DEFAULT_VALUE = "defaultSortValue";

const sortValues = Object.values(GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue);

const SelectSortBids = ({ setSort, className }: Props) => {
  const { t } = useTranslation("historique");

  const sortOptions = sortValues.map(stat => ({
    value: stat,
    label: t(`sortType.${stat}`),
  }));

  const defaultOption = {
    value: DEFAULT_VALUE,
    label: t(`sortType.${DEFAULT_VALUE}`),
  };

  const options = [defaultOption, ...sortOptions];
  const [selectOptions, setSelectOptions] = useState(options);

  return (
    <Select
      showRequiredStar
      className={className}
      placeholder={DEFAULT_VALUE}
      defaultValue={DEFAULT_VALUE}
      options={{ groups: [{ key: "sort_options", options: selectOptions }] }}
      onValueChange={(
        value:
          | GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue
          | typeof DEFAULT_VALUE,
      ) => {
        if (value === DEFAULT_VALUE) {
          setSort(
            GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue.AUCTION_END_DATE_DESC,
          );

          return;
        }
        if (selectOptions.length === sortValues.length + 1) {
          setSelectOptions(sortOptions);
        }
        setSort(value);
      }}
    />
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default SelectSortBids;
