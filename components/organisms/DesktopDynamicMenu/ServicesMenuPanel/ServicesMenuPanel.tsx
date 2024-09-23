import TranslatableLink from "@/components/atoms/TranslatableLink";
import { generateUrl } from "@/urls/linksTranslation";
import { dynamicMenuData, dynamicMenuLinks, isServicePlus } from "@/utils/dynamicMenuConstants";
import { useTranslation } from "@/utils/next-utils";

import ServicePanel from "../../ServicePanel";
import styles from "./ServicesMenuPanel.module.scss";

type Props = {
  closeNavigationMenu: () => void;
};

const ServicesMenuPanel = ({ closeNavigationMenu }: Props) => {
  const { t, lang } = useTranslation("common");

  const title = dynamicMenuData[3].items?.[0].label ?? "";
  const tailorMadeServices = dynamicMenuData[3].items?.[0].items ?? [];

  return (
    <div className={styles.container}>
      <span className={styles.title}>{t(`header.dynamicMenu.${title}`)}</span>
      <div className={styles.root}>
        {tailorMadeServices.map((service, serviceIndex) => {
          const serviceLabel = service.label;
          if (!(serviceLabel in dynamicMenuLinks)) {
            return <>⚠️ Missing link for {serviceLabel} in dynamicMenuLinks</>;
          }
          const typedServiceLabel = serviceLabel as keyof typeof dynamicMenuLinks;

          return (
            <TranslatableLink
              href={generateUrl(dynamicMenuLinks[typedServiceLabel].pageKey, lang)}
              className={styles.link}
              key={serviceIndex}
              onClick={closeNavigationMenu}
              dontTranslate
            >
              {isServicePlus(service.label) && <ServicePanel label={service.label} />}
            </TranslatableLink>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesMenuPanel;
