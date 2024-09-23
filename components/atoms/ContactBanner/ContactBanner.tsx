import Image from "next/image";

import { CustomerJsonldShopCustomerReadCustomerCommunicationManager } from "@/networking/sylius-api-client/.ts.schemas";
import { replaceImageBaseUrlWithOriginal } from "@/utils/imageUtils";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ContactBanner.module.scss";

type Props = {
  customerCommunicationManager: CustomerJsonldShopCustomerReadCustomerCommunicationManager;
};

const ContactBanner = ({ customerCommunicationManager }: Props) => {
  const { t } = useTranslation("accueil-profil");

  return (
    <div className={styles.mainContainer}>
      <Image
        src={replaceImageBaseUrlWithOriginal(
          customerCommunicationManager?.imageSrc ?? "/noCCMphoto.png",
        )}
        alt="Customer communication manager photo"
        width={200}
        height={200}
        className={styles.image}
      />

      <div className={styles.contactContainer}>
        <span className={styles.title}>{t("loyaltyProgramMenu.yourContact")}</span>
        <span className={styles.contactName}>
          {customerCommunicationManager?.firstName} {customerCommunicationManager?.lastName}
        </span>
        <span>{customerCommunicationManager?.mail}</span>
        <span>{customerCommunicationManager?.phoneNumber}</span>
      </div>
    </div>
  );
};

export default ContactBanner;
