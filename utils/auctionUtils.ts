import { AuctionItemDTOJsonldShopAuctionItemDtoRead } from "@/networking/sylius-api-client/.ts.schemas";

export const isAuctionFinished = (
  auctionItem: AuctionItemDTOJsonldShopAuctionItemDtoRead,
  clientAndServerTimeDifference: number,
) => {
  const auctionCatalogEndDate = auctionItem.endDate ?? null;
  const serverTime = Date.now() + clientAndServerTimeDifference;
  const endDate: number | null =
    auctionCatalogEndDate !== null ? new Date(auctionCatalogEndDate).getTime() : null;

  return endDate !== null ? serverTime > endDate : false;
};
