import ShippingOptimizationDisclaimer from "@/components/molecules/ShippingOptimizationDisclaimer";
import { OrderJsonldShopCartRead } from "@/networking/sylius-api-client/.ts.schemas";
import { CartWithShippingMethodConfiguration } from "@/types/Carts";
import { getVolumeCountersByCartItems } from "@/utils/shippingFees";

type Props = {
  cart: OrderJsonldShopCartRead | CartWithShippingMethodConfiguration | undefined;
};

// Type guard to check if the cart is a CartWithShippingMethodConfiguration
const isCart = (
  cart: OrderJsonldShopCartRead | CartWithShippingMethodConfiguration | undefined,
): cart is CartWithShippingMethodConfiguration => {
  if (cart?.shipments?.length === 0) {
    return false;
  }

  return (
    typeof (cart as CartWithShippingMethodConfiguration).shipments[0].method.configuration
      .slice1 === "number"
  );
};

const CartShippingOptimization = ({ cart }: Props) => {
  if (!isCart(cart)) {
    return null;
  }

  const getTotalVolumeCounters = () => {
    const cartVolumeCounters = getVolumeCountersByCartItems(cart.items);
    cart.groupedOrders?.reduce((acc, groupedOrder) => {
      const groupedOrderVolumeCounters = getVolumeCountersByCartItems(groupedOrder.items);
      acc.bottles += groupedOrderVolumeCounters.bottles;
      acc.magnums += groupedOrderVolumeCounters.magnums;
      acc.others += groupedOrderVolumeCounters.others;

      return acc;
    }, cartVolumeCounters);

    return cartVolumeCounters;
  };

  // Calculate the number of different volumes in the cart
  const { bottles, magnums, others } = getTotalVolumeCounters();

  return (
    <ShippingOptimizationDisclaimer
      paymentMethod={cart.shipments[0].method}
      bottles={bottles}
      magnums={magnums}
      others={others}
    />
  );
};

export default CartShippingOptimization;
