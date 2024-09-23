import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";

import styles from "./CheckoutNavigationLink.module.scss";

type CheckoutNavigationLinkProps = {
  href: string;
  state: "progress" | "done" | "pending";
  icon: IconProp;
  children: React.ReactNode;
};

const CheckoutNavigationLink = ({ href, state, icon, children }: CheckoutNavigationLinkProps) => {
  const innerContent = (
    <div className={clsx(styles.checkoutNavigationLinkContainer)}>
      <div className={styles.checkoutNavigationContent}>
        <div
          className={clsx(
            styles.checkoutNavigationIcon,
            state === "done" && styles.done,
            state === "progress" && styles.progress,
            state === "pending" && styles.pending,
          )}
        >
          <FontAwesomeIcon icon={icon} size="xl" />
        </div>
        <div className={styles.navigationLinkText}>{children}</div>
      </div>
    </div>
  );

  const CreateContent = () => {
    if (state === "done") {
      return (
        <TranslatableLink href={href} className={styles.navigationLink}>
          {innerContent}
        </TranslatableLink>
      );
    }

    return innerContent;
  };

  return <CreateContent />;
};

export default CheckoutNavigationLink;
