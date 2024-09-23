import { faInfoCircle } from "@fortawesome/pro-light-svg-icons/faInfoCircle";
import { faPrint } from "@fortawesome/pro-light-svg-icons/faPrint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import Trans from "next-translate/Trans";
import Image from "next/image";
import { ReactNode } from "react";

import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("formulaire-virement");

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <section>
        <header className={styles.header}>
          <Image
            src="/logo-idealwine.svg"
            alt="iDealwine logo"
            width={150}
            height={40}
            className={clsx(styles.logo)}
          />

          <div className={styles.titleBlock}>
            <div className={styles.titleAndIcon}>
              <FontAwesomeIcon
                icon={faPrint}
                size="lg"
                onClick={() => window.print()}
                className={styles.icon}
              />
              <h1 className={styles.title}>{t("title")}</h1>
            </div>
            <Button className={styles.hideOnPrint} onClick={() => window.print()}>
              {t("calloutPrint")}
            </Button>
          </div>
        </header>

        <article>
          <aside>
            <p className={clsx(styles.callout, styles.hideOnPrint)}>
              <FontAwesomeIcon
                icon={faInfoCircle}
                size="1x"
                onClick={() => window.print()}
                className={styles.icon}
              />
              <Trans
                ns="formulaire-virement"
                i18nKey="callout"
                // eslint-disable-next-line react/jsx-key
                components={[
                  <button key="1" onClick={() => window.print()} className={styles.printButton} />,
                ]}
                values={{ link: t<ReactNode>("calloutPrint") }}
              />
            </p>
            <div className={styles.columns}>
              <form className={styles.column}>
                <Input name="textfield" label={t("fields.name")} type="text" />
                <Input name="textfield" label={t("fields.firstName")} type="text" />
                <Input name="textfield" label={t("fields.address")} type="text" />
                <Input name="textfield" label={t("fields.email")} type="text" />
                <Input name="textfield" label={t("fields.phone")} type="text" />
              </form>

              <form className={styles.column}>
                <Input name="textfield" label={t("fields.zipCode")} type="text" />
                <Input name="textfield" label={t("fields.city")} type="text" />
                <Input name="textfield" label={t("fields.country")} type="text" />
                <Input name="textfield" label={t("fields.username")} type="text" />
              </form>
            </div>
            <hr className={styles.hr} />
            <small>{t("legalNotice")}</small>

            <div className={styles.signInfo}>
              <Input
                label={t("fields.date")}
                name="textfield"
                placeholder={t("fields.date")}
                type="text"
              />
              <Input
                label={t("fields.place")}
                name="textfield"
                placeholder={t("fields.place")}
                type="text"
              />
            </div>
            <hr className={styles.hr} />
            {t("signature")}
            <br />
            <br />
            <small className={styles.hideOnPrint}>{t("instructions")}</small>
            <br />
            <small className={styles.hideOnPrint}>{t("credits")}</small>
          </aside>
        </article>
      </section>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
