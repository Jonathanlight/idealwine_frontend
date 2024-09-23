import ShippingMethodButton from "@/components/molecules/ShippingMethodButton/ShippingMethodButton";
import {
  RelayPointDTOJsonld,
  ShippingMethodJsonldShopShippingMethodRead,
} from "@/networking/sylius-api-client/.ts.schemas";

import styles from "./OnSiteComponent.module.scss";

type Props = {
  availableMethodsList: ShippingMethodJsonldShopShippingMethodRead[];
  selectedMethod: string;
  onShippingMethodChange: (newShippingMethod: string) => void;
  setFormData: (newShippingMethod: string, relayPointData?: RelayPointDTOJsonld) => void;
};

const OnSiteComponent = ({
  availableMethodsList,
  selectedMethod,
  onShippingMethodChange,
  setFormData,
}: Props) => {
  return (
    <>
      {availableMethodsList.map(shippingMethod => (
        <ShippingMethodButton
          key={shippingMethod.id}
          changeShippingMethod={() => {
            setFormData(shippingMethod.code);
            onShippingMethodChange(shippingMethod.code);
          }}
          name={shippingMethod.name}
          code={shippingMethod.code}
          description={shippingMethod.description}
          isSelected={selectedMethod === shippingMethod.code}
          showAutomaticContent={false}
        >
          <div className={styles.titleContainer}>{shippingMethod.name}</div>
          <div className={styles.descriptionContainer}>{shippingMethod.description}</div>
        </ShippingMethodButton>
      ))}
    </>
  );
};

export default OnSiteComponent;
