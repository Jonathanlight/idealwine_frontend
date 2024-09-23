import { CustomsFeeRateShopCustomsFeeRateRead } from "@/networking/sylius-api-client/.ts.schemas";

import { BUYER_FEE_PERCENTAGE, TVA_PERCENTAGE_FRANCE } from "./constants";
import { isNotNullNorUndefined } from "./ts-utils";

export const getBuyerFee = (auctionOrderAmount: number, buyerFeePercentage: number): number => {
  const buyerFee = auctionOrderAmount * (buyerFeePercentage / 100);

  return parseFloat(buyerFee.toFixed(2));
};

export const getVATOnBuyerFee = (
  auctionOrderAmount: number,
  buyerFeePercentage: number,
  VATPercentage: number,
): number => {
  const buyerFee = getBuyerFee(auctionOrderAmount, buyerFeePercentage);

  const VATOnBuyerFee = buyerFee * (VATPercentage / 100);

  return parseFloat(VATOnBuyerFee.toFixed(2));
};

export const getCustomDutiesFee = (
  auctionOrderAmount: number,
  buyerFeePercentage: number,
  customDutiesFeePercentage: number,
  numberOfBottles: number,
  priceByBottle: number,
): number => {
  const buyerFee = getBuyerFee(auctionOrderAmount, buyerFeePercentage);

  const customDutiesFee =
    (auctionOrderAmount + buyerFee) * customDutiesFeePercentage + priceByBottle * numberOfBottles;

  return parseFloat(customDutiesFee.toFixed(2));
};

export const getAllIncludedAmount = (
  auctionOrderAmount: number,
  buyerFee: number,
  VATOnBuyerFee: number,
  customDutiesFee: number,
): number => {
  return auctionOrderAmount + buyerFee + VATOnBuyerFee + customDutiesFee;
};

export const calculateFees = (
  initialNextAuctionOrderAmount: number,
  numberOfBottles: number,
  customsFeeRate: CustomsFeeRateShopCustomsFeeRateRead | undefined,
) => {
  const buyerFeePercentage = BUYER_FEE_PERCENTAGE * 100;
  const VATPercentage = TVA_PERCENTAGE_FRANCE * 100;
  const fullAmountPercentage = customsFeeRate?.fullAmountPercentage;
  const priceByBottle = customsFeeRate?.priceByBottle;
  const customDutiesFeePercentage = isNotNullNorUndefined(fullAmountPercentage)
    ? fullAmountPercentage
    : 0;
  const customsFeeRatePriceByBottle = isNotNullNorUndefined(priceByBottle) ? priceByBottle : 0;

  const buyerFee = getBuyerFee(initialNextAuctionOrderAmount, buyerFeePercentage);
  const VATOnBuyerFee = getVATOnBuyerFee(
    initialNextAuctionOrderAmount,
    buyerFeePercentage,
    VATPercentage,
  );

  const customDutiesFee = getCustomDutiesFee(
    initialNextAuctionOrderAmount,
    buyerFeePercentage,
    customDutiesFeePercentage,
    numberOfBottles,
    customsFeeRatePriceByBottle,
  );
  const allIncludedAmount = getAllIncludedAmount(
    initialNextAuctionOrderAmount,
    buyerFee,
    VATOnBuyerFee,
    customDutiesFee,
  );

  return { buyerFee, VATOnBuyerFee, customDutiesFee, allIncludedAmount };
};
