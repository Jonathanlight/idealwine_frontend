import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { AuctionCatalogJsonldShopAuctionCatalogRead } from "@/networking/sylius-api-client/.ts.schemas";
import {
  getAuctionCatalogCollection,
  getGetAuctionCatalogCollectionQueryKey,
} from "@/networking/sylius-api-client/auction-catalog/auction-catalog";
import { MAXIMUM_OVERTIME_BIDDING, STALE_TIME_MINUTE } from "@/utils/constants";
import { nextLangToSyliusLocale } from "@/utils/locale";

type ValidatedAuctionCatalogsType = {
  [key: string]: AuctionCatalogJsonldShopAuctionCatalogRead[];
};

export const useGetCurrentAuctionCatalogs = (lang: string, isActive: boolean) => {
  const currentDate = new Date();
  const currentDateMinusMaximumOvertimeBidding = new Date(
    currentDate.getTime() - MAXIMUM_OVERTIME_BIDDING,
  );
  const formattedCurrentDate = currentDate.toISOString();
  const formattedCurrentDateMinusMaximumOvertimeBidding =
    currentDateMinusMaximumOvertimeBidding.toISOString();
  const { data: auctionCatalogs, isLoading } = useQuery({
    staleTime: STALE_TIME_MINUTE,
    queryKey: getGetAuctionCatalogCollectionQueryKey(),
    queryFn: () =>
      getAuctionCatalogCollection(
        {
          "order[endDate]": "asc",
          "startDate[before]": formattedCurrentDate,
          "endDate[after]": formattedCurrentDateMinusMaximumOvertimeBidding,
        },
        { headers: { "Accept-Language": nextLangToSyliusLocale(lang) } },
      ),
    enabled: isActive,
  });

  if (isLoading || !auctionCatalogs) return;

  const validatedAuctionCatalogs: ValidatedAuctionCatalogsType = {};

  auctionCatalogs["hydra:member"].forEach(auctionCatalog => {
    const endDateWithoutTime = format(new Date(auctionCatalog.endDate ?? ""), "dd MMMM yyyy");

    if (!(endDateWithoutTime in validatedAuctionCatalogs)) {
      validatedAuctionCatalogs[endDateWithoutTime] = [];
    }

    validatedAuctionCatalogs[endDateWithoutTime].push(auctionCatalog);
  });

  return validatedAuctionCatalogs;
};
