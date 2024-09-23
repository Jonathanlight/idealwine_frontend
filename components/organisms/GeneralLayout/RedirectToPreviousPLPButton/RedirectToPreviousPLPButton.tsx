import { useRouter } from "next/router";
import React from "react";

import Button from "@/components/atoms/Button";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useTranslation } from "@/utils/next-utils";

import styles from "./RedirectToPreviousPLPButton.module.scss";

type Props = {
  children: React.ReactNode;
};

const RedirectToPreviousPLPButton = ({ children }: Props) => {
  const router = useRouter();
  const { lang } = useTranslation("acheter-vin");

  const goToPreviousPath = () => {
    if (router.query.fromPLP === "true") {
      router.back();
    } else {
      void router.push(getPlpUrl({ isDirectPurchase: ["false"] }, lang));
    }
  };

  return (
    <Button onClick={goToPreviousPath} variant="primaryBlack" className={styles.button}>
      {children}
    </Button>
  );
};

export default RedirectToPreviousPLPButton;
