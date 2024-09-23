import DOMPurify from "isomorphic-dompurify";
import { TranslationQuery } from "next-translate";

import { useTranslation } from "@/utils/next-utils";

export type Props = {
  className?: string;
  i18nKey: string;
  namespace?: string;
  values?: TranslationQuery;
};

const TransP = ({ i18nKey, className, namespace, values }: Props): JSX.Element => {
  const { t } = useTranslation(namespace);

  return (
    <p
      className={className}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(i18nKey, values)) }}
    />
  );
};

export const getTransP = (namespace?: string) => {
  const NamespacedTransP = (props: Omit<Props, "namespace">) => {
    return <TransP namespace={namespace} {...props} />;
  };

  return NamespacedTransP;
};

export default TransP;
