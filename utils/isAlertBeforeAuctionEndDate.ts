import { isNotNullNorUndefined } from "./ts-utils";

export const isAlertBeforeAuctionEndDate = (
  numberOfSeconds: number,
  auctionCatalogEndDate: string | null | undefined,
) => {
  if (isNotNullNorUndefined(auctionCatalogEndDate)) {
    const endDate = new Date(auctionCatalogEndDate);

    const now = new Date();

    const nowPlusNumberOfSeconds = new Date(now.getTime() + numberOfSeconds * 1000);

    return nowPlusNumberOfSeconds < endDate;
  }
};
