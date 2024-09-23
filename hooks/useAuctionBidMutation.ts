import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import {
  AuctionItemDTOAuctionBidDTOJsonld,
  AuctionItemDTOAuctionBidResultDTOShopAuctionItemDtoRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  getGetAuctionItemDTOItemQueryKey,
  postAuctionItemDTOItem,
} from "@/networking/sylius-api-client/auction-item-dt-o/auction-item-dt-o";
import { ErrorWithNormalizableErrorCode, isClientStatusCodeError } from "@/utils/networking-utils";

/**
 * This hook is used to post bid event to the backend.
 *
 * We send the bid event to the backend when:
 * - The user bids
 * - The user sets a bid threshold
 *
 */
type Props = {
  auctionItemCode: string;
  auctionBidDTO: AuctionItemDTOAuctionBidDTOJsonld;
  onSuccess: (data: AuctionItemDTOAuctionBidResultDTOShopAuctionItemDtoRead) => void;
  onError: (error: ErrorWithNormalizableErrorCode) => void;
};

const useAuctionBidMutation = ({ auctionItemCode, auctionBidDTO, onSuccess, onError }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => postAuctionItemDTOItem(auctionItemCode, auctionBidDTO),
    onSuccess,
    onError,
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: getGetAuctionItemDTOItemQueryKey(auctionItemCode),
      });
    },
    retry: (failureCount, error) => {
      const MAX_RETRIES = 3;

      failureCount++;
      if (failureCount > MAX_RETRIES) {
        return false;
      }

      if (!isAxiosError(error) || isClientStatusCodeError(error.response.status)) {
        return false;
      }

      return true;
    },
    retryDelay: 500,
  });

  return { mutate, isLoading };
};

export default useAuctionBidMutation;
