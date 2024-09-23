import {
  getAllIncludedAmount,
  getBuyerFee,
  getCustomDutiesFee,
  getVATOnBuyerFee,
} from "./FeesHandler";

describe("getBuyerFee", () => {
  it("should calculate the buyer fee correctly", () => {
    const auctionOrderAmount = 55;
    const buyerFeePercentage = 21;
    const expectedBuyerFee = 11.55;
    const buyerFee = getBuyerFee(auctionOrderAmount, buyerFeePercentage);

    expect(buyerFee).toEqual(expectedBuyerFee);
  });
});

describe("getVATOnBuyerFee", () => {
  it("should calculate the VAT on buyer fee correctly", () => {
    const auctionOrderAmount = 55;
    const buyerFeePercentage = 21;
    const VATPercentage = 20;
    const expectedVATOnBuyerFee = 2.31;

    const VATOnBuyerFee = getVATOnBuyerFee(auctionOrderAmount, buyerFeePercentage, VATPercentage);

    expect(VATOnBuyerFee).toEqual(expectedVATOnBuyerFee);
  });
});

describe("getCustomDutiesFee", () => {
  it.each([
    [100, 10, 0, 5, 0, 0],
    [55, 21, 0.2, 1, 3.4, 16.71],
    [55, 21, 0.15, 1, 6, 15.98],
  ])(
    "should calculate the custom duties fee correctly for %s orders",
    (
      auctionOrderAmount,
      buyerFeePercentage,
      customDutiesFeePercentage,
      numberOfBottles,
      priceByBottle,
      expectedCustomDutiesFee,
    ) => {
      const customDutiesFee = getCustomDutiesFee(
        auctionOrderAmount,
        buyerFeePercentage,
        customDutiesFeePercentage,
        numberOfBottles,
        priceByBottle,
      );

      expect(customDutiesFee).toEqual(expectedCustomDutiesFee);
    },
  );
});

describe("getAllIncludedAmount", () => {
  it("should calculate the total amount correctly", () => {
    const auctionOrderAmount = 100;
    const buyerFee = 10;
    const VATOnBuyerFee = 2;
    const customDutiesFee = 53.4;
    const expectedTotalAmount = 165.4;

    const totalAmount = getAllIncludedAmount(
      auctionOrderAmount,
      buyerFee,
      VATOnBuyerFee,
      customDutiesFee,
    );

    expect(totalAmount).toEqual(expectedTotalAmount);
  });
});
