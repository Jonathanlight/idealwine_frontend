import Button from "@/components/atoms/Button";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./BarometerOrLogin.module.scss";

type Props = {
  iframeTitle: string;
  iframeSrc: string;
  title: string;
  connexionMessage: string;
};

const BarometerOrLogin = ({ iframeTitle, iframeSrc, title, connexionMessage }: Props) => {
  const { user, setIsLoginModalOpen } = useAuthenticatedUserContext();
  const userIsConnected = isNotNullNorUndefined(user);

  const handleConnect = () => {
    if (!userIsConnected) {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className={styles.iframeContainer}>
      {userIsConnected ? (
        <iframe
          src={iframeSrc}
          title={iframeTitle}
          className={styles.iframe}
          allowFullScreen={true}
          allowTransparency={true}
        />
      ) : (
        <>
          <h1 className={styles.disconnectedTitle}>{title}</h1>
          <Button variant="primaryBlack" onClick={handleConnect} className={styles.connexionButton}>
            {connexionMessage}
          </Button>
        </>
      )}
    </div>
  );
};

export default BarometerOrLogin;
