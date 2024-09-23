import {
  AddressJsonldShopAddressCreate,
  RelayPointDTORelayPointInputDataDTOJsonld,
} from "@/networking/sylius-api-client/.ts.schemas";

export type FormType = {
  shippingAddress: AddressJsonldShopAddressCreate & { countryCodeDisplay: string };
  relayPoint: RelayPointDTORelayPointInputDataDTOJsonld;
  giftMessage: string;
};
