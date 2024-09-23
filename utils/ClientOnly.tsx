import { PropsWithChildren, ReactNode, useEffect, useState } from "react";

type Props = {
  serverFallback?: ReactNode;
} & PropsWithChildren;

const ClientOnly = ({ children, serverFallback }: Props): JSX.Element => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <>{mounted ? children : serverFallback}</>;
};

export default ClientOnly;

export const useClientOnlyValue = <T,>(value: T, firstRenderValue: T): T => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? value : firstRenderValue;
};
