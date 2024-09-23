import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Referral.module.scss";

type Props = {
  referralCode: string;
};

const Referral = ({ referralCode }: Props): JSX.Element => {
  const { t } = useTranslation("accueil-profil");

  const shareData = {
    title: t("myReferralCode"),
    text: referralCode,
    url: "https://idealwine.com",
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const canShare = navigator["share"] !== undefined && navigator.canShare(shareData);

  return (
    <div id="referral" className={styles.bigCard}>
      <div className={styles.shareLink}>
        <div className={styles.promoContainer}>
          <div className={styles.promoContent}>
            <div className={styles.promoMain}>
              <div className={styles.promoTitle}>{t("referYourFriends")}</div>
              <div className={styles.promoOffers}>
                <div className={styles.promoOffer}>
                  <div className={styles.promoOfferAmount}>{t("15e")}</div>
                  <div className={styles.promoOfferText}>
                    {t("forYou")}
                    <sup> [1]</sup>
                  </div>
                </div>
                <div className={styles.and}>&</div>
                <div className={styles.promoOffer}>
                  <div className={styles.promoOfferAmount}>{t("15e")}</div>
                  <div className={styles.promoOfferText}>
                    {t("forHim")}
                    <sup> [2]</sup>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.promoSubtitle}>
              <div>[1]{t("conditionForYou")}</div>
              <div>[2]{t("conditionForHim")}</div>
            </div>
          </div>
        </div>
        <div className={styles.shareContainer}>
          <div className={styles.shareContent}>
            <div className={styles.shareCard}>
              <Input type="text" disabled value={referralCode} />
              <Button
                variant="primaryGolden"
                onClick={async () => {
                  await navigator.clipboard.writeText(referralCode);
                  toast.success<string>(t("copiedToClipboard"));
                }}
              >
                {t("copy")}
              </Button>
            </div>
            {canShare && (
              <Button
                className={styles.shareButton}
                variant="primaryGolden"
                onClick={() => navigator.share(shareData)}
              >
                {t("shareLink")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
