import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import OpenAIChatbot from "../ChatBot/ChatBot";
import styles from "./ChatbotOrLogin.module.scss";

const ChatbotOrLogin = () => {
  const { t } = useTranslation("chatbot");
  const { user, setIsLoginModalOpen } = useAuthenticatedUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  const handleConnect = () => {
    if (user === null || user === undefined) {
      setIsLoginModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderOverlay}>
        <FontAwesomeIcon icon={faSpinnerThird} spin size="xl" />
      </div>
    );
  }

  const userIsConnected = isNotNullNorUndefined(user);

  return (
    <div className={styles.container}>
      {userIsConnected ? (
        <OpenAIChatbot />
      ) : (
        <>
          <h1 className={styles.disconnectedTitle}>{t("h1")}</h1>
          <h2>{t("h2")}</h2>
          <Button variant="primaryBlack" onClick={handleConnect} className={styles.connexionButton}>
            {t("connect")}
          </Button>
        </>
      )}
    </div>
  );
};

export default ChatbotOrLogin;
