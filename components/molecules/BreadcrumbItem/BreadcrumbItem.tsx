import clsx from "clsx";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";

import styles from "../../organisms/Breadcrumb/Breadcrumb.module.scss";

type Props = {
  link: string;
  name: string;
  isLast?: boolean;
  dontTranslate?: boolean;
};

const BreadcrumbItem = ({ link, name, isLast, dontTranslate = false }: Props) => {
  return (
    <TranslatableLink
      href={link}
      dontTranslate={dontTranslate}
      className={clsx(isLast && styles.isLastBreadcrumbItem)}
    >
      {name}
    </TranslatableLink>
  );
};

export default BreadcrumbItem;
