import { useEffect, useState } from "react";

import usePrevious from "./usePrevious";

type Props = {
  thresholdBid: number | null | undefined;
  updateThresholdBid: () => void;
};

/**
 * This hook is used to reset the auction threshold amount when the auction item is stale.
 *
 * We want to set the amount:
 * - When the user is not bidding (otherwise the use would lose the price he is setting)
 * - When the auction item is stale
 */
const useResetThresholdBidWhenStale = ({ thresholdBid, updateThresholdBid }: Props) => {
  const [isBidding, setIsBidding] = useState(false);
  const [isThresholdStale, setIsThresholdStale] = useState(false);

  const previousThresholdBidValue = usePrevious(thresholdBid);

  // If the previous highest bid value is different from the current auction item bid,
  // then the auction item is stale.
  useEffect(() => {
    if (previousThresholdBidValue !== undefined && previousThresholdBidValue !== thresholdBid) {
      setIsThresholdStale(true);
    }
  }, [previousThresholdBidValue, thresholdBid]);

  useEffect(() => {
    // If the user is bidding or the auction item is not stale, then we don't want to reset the amount.
    if (isBidding || !isThresholdStale) {
      return;
    }

    // If the user is not bidding and the auction item is stale, then we want to reset the amount.
    updateThresholdBid();
    // Reset the state.
    setIsThresholdStale(false);
    setIsBidding(false);
  }, [isBidding, isThresholdStale, updateThresholdBid]);

  return {
    // We need to expose the setIsBidding function so that the parent component can set the state.
    setIsBidding,
  };
};

export default useResetThresholdBidWhenStale;
