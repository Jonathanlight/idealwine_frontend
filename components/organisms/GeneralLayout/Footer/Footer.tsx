import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons/faFacebookSquare";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons/faLinkedinIn";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";
import { faYoutube } from "@fortawesome/free-brands-svg-icons/faYoutube";
import { faBlog } from "@fortawesome/pro-light-svg-icons/faBlog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import clsx from "clsx";
import Image from "next/image";
import Script from "next/script";
import { useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button/Button";
import LinkButton from "@/components/atoms/Button/LinkButton";
import Input from "@/components/atoms/Input/Input";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import { useNewsletterPostCustomerCollection } from "@/networking/sylius-api-client/customer/customer";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";

import SubscribedToNewsletterDialog from "../../SubscribedToNewsletterDialog/SubscribedToNewsletterDialog";
import styles from "./Footer.module.scss";

const Footer = () => {
  const { t, lang } = useTranslation("common");

  const [email, setEmail] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const { mutateAsync: subscribeToNewsletter } = useNewsletterPostCustomerCollection();

  const subscribeToNewsletterHandler = async () => {
    try {
      await subscribeToNewsletter({
        data: {
          email: email,
          localeCode: nextLangToSyliusLocale(lang),
        },
      });
      setEmailModalOpen(true);
      sendGTMEvent({ event: "newsletterSubscription", goalType: "inscription_newsletter" });
    } catch (err) {
      toast.error<string>(t("common.errorOccurred"));
    }
  };

  return (
    <>
      <Script strategy="afterInteractive" src={t("urls.urlavis")}></Script>
      <SubscribedToNewsletterDialog open={emailModalOpen} setOpen={setEmailModalOpen} />
      <footer className={styles.whiteBackground}>
        <div className={styles.newsletterFooterViewport}>
          <div className={styles.newsletterFooter}>
            <div className={styles.newsletterPresentation}>
              <h2 className={styles.presentationTitle}>{t("footer.newsletterTitle")}</h2>
              <div className={styles.presentationUnderlineTitle}></div>
              <p className={styles.presentationDescription}>
                {t("footer.newsletterText")}
                <br />
                <br />
                <TranslatableLink
                  href={t("footer.newsletterLink")}
                  className={styles.newsletterLink}
                  dontTranslate
                >
                  {t("footer.newsletterNotification")}
                </TranslatableLink>
              </p>
            </div>
            <div className={styles.emailSubscription}>
              <Image src="/Hiver-4.jpg" fill={true} id="newsletter" alt={"newsletter"} />
              <Input
                inputClassName={styles.input}
                type="email"
                placeholder={t("footer.emailPrompt")}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button
                className={styles.subscriptionButton}
                variant="primaryBlack"
                onClick={subscribeToNewsletterHandler}
              >
                {t("footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.navigationFooterBackground}>
          <div className={styles.navigationFooterViewport}>
            <div className={styles.contactButtonContainer}>
              <LinkButton
                href="CONTACT_URL"
                className={styles.contactButton}
                variant="primaryBlack"
              >
                {t("footer.contactUs")}
              </LinkButton>
            </div>
            <div className={styles.navigationLinks}>
              <div className={styles.navigationLinksLine}>
                <div className={styles.navigationLinkContainer}>
                  <TranslatableLink
                    className={styles.navigationLink}
                    href="FREE_WINE_ESTIMATION_URL"
                  >
                    {t("footer.linkCellarValuation")}
                  </TranslatableLink>
                </div>
                <div className={styles.navigationLinkContainer}>
                  <a
                    href={t("urls.urlRecruitement")}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.navigationLink}
                  >
                    {t("footer.linkRecruitment")}
                  </a>
                </div>
                <div className={styles.navigationLinkContainer}>
                  <TranslatableLink className={styles.navigationLink} href="ABOUT_US_URL">
                    {t("footer.linkAboutUs")}
                  </TranslatableLink>
                </div>
              </div>
              <div className={styles.navigationLinksLine}>
                <div className={styles.navigationLinkContainer}>
                  <TranslatableLink className={styles.navigationLink} href="DELIVERY_FEES_URL">
                    {t("footer.linkDeliveryFees")}
                  </TranslatableLink>
                </div>
                <div className={styles.navigationLinkContainer}>
                  <TranslatableLink className={styles.navigationLink} href="PARTNERS_URL">
                    {t("footer.linkPartners")}
                  </TranslatableLink>
                </div>
                <div className={clsx(styles.navigationLinkContainer, styles.navigationLink)}>
                  <a href={t("urls.urlblogPress")}>{t("footer.linkPress")}</a>
                </div>
              </div>
            </div>
            <div className={styles.socialNetworkIcons}>
              <a
                href={t("urls.urlFacebook")}
                aria-label="facebook"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon className={styles.socialNetworksIcon} icon={faFacebookSquare} />
              </a>
              <a href={t("urls.urlTwitter")} aria-label="twitter" target="_blank" rel="noreferrer">
                <FontAwesomeIcon className={styles.socialNetworksIcon} icon={faXTwitter} />
              </a>
              <a
                href={t("urls.urlInstagram")}
                aria-label="instagram"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon className={styles.socialNetworksIcon} icon={faInstagram} />
              </a>
              <a href={t("urls.urlYoutube")} aria-label="youtube" target="_blank" rel="noreferrer">
                <FontAwesomeIcon className={styles.socialNetworksIcon} icon={faYoutube} />
              </a>
              <a
                href={t("urls.urlLinkedin")}
                aria-label="linkedin"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon className={styles.socialNetworksIcon} icon={faLinkedinIn} />
              </a>
              <a
                href={t("urls.urlBlogIdealwine")}
                aria-label="blog idealwine"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon className={styles.socialNetworksIcon} icon={faBlog} />
              </a>
            </div>
          </div>
        </div>
        <div className={styles.legalFooterViewport}>
          <div className={styles.legalMentions}>
            {t("footer.legalMentions", { year: new Date().getFullYear() })}
            <TranslatableLink href="GENERAL_CONDITIONS_URL">{t("footer.GTC")}</TranslatableLink>
            <TranslatableLink href="FAQ_URL">{t("footer.FAQ")}</TranslatableLink>
            <TranslatableLink href="PERSONAL_DATA">{t("footer.personalData")}</TranslatableLink>
          </div>
          {lang === "fr" ? (
            <div className={styles.legalPreventionFr}>
              <div className={styles.legalPreventionLogoContainer}>
                <Image
                  src={`/Marianne-ETAT.jpg`}
                  alt={""}
                  width={135}
                  height={80}
                  className={styles.legalPreventionLogo}
                />
              </div>
              <div className={styles.legalPreventionText}>
                <div className={styles.legalPreventionTitle}>
                  {t("footer.legalPreventionTitle")}
                </div>
                <div>{t("footer.legalPreventionText")}</div>
              </div>
            </div>
          ) : (
            <div className={styles.legalPreventionNotFr}>{t("footer.legalPreventionText")}</div>
          )}
        </div>
      </footer>
    </>
  );
};

export default Footer;
