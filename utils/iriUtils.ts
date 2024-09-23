export const getProductVariantIRI = (code: string) => {
  return `/api/v2/shop/product-variants/${code}`;
};

export const getCustomerIRI = (code: string) => {
  return `/api/v2/shop/customers/${code}`;
};

export const getProductVariantInAuctionCatalogIRI = (productVariantInAuctionCatalogId: number) => {
  return `/api/v2/product-variant-in-auction-catalogs/${productVariantInAuctionCatalogId}`;
};

export const getOrderItemIRI = (orderItemId: number) => {
  return `/api/v2/shop/order-items/${orderItemId}`;
};

export const getCurrencyIRI = (code: string) => {
  return `/api/v2/shop/currencies/${code}`;
};

export const getIdFromIRI = (iri: string) => iri.split("/").at(-1);
