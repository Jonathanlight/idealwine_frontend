import { NextSeo } from "next-seo";
import Trans from "next-translate/Trans";

import { LastOrderSection } from "@/components/organisms/LastOrderSection/LastOrderSection";
import {
  getGetOrderEventHistoryCollectionQueryKey,
  getOrderEventHistoryCollection,
  useGetOrderEventHistoryCollection,
} from "@/networking/sylius-api-client/order-event-history/order-event-history";
import { CACHE_DURATIONS_IN_SECONDS, STALE_TIME_MINUTE } from "@/utils/constants";
import {
  DecoratedGetServerSideProps,
  withCommonPagePropsDecorator,
} from "@/utils/getCommonPageProps";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";
const Page = () => {
  const { t } = useTranslation();

  const { data: lastOrderEvents } = useGetOrderEventHistoryCollection(
    {},
    { query: { staleTime: STALE_TIME_MINUTE } },
  );

  return (
    <div className={styles.mainContainer}>
      <NextSeo title={t("last-order:seo.title")} description={t("last-order:seo.description")} />
      <h1 className={styles.mainTitle}>
        <Trans
          ns="last-order"
          i18nKey="title"
          // eslint-disable-next-line react/jsx-key
          components={[<strong />]}
        />
      </h1>
      <p className={styles.subtitle}>
        <Trans
          ns="last-order"
          i18nKey="subtitle"
          // eslint-disable-next-line react/jsx-key
          components={[<strong />]}
        />
      </p>
      {lastOrderEvents?.["hydra:member"].map((orderEvent, index) => (
        <LastOrderSection key={index} orderEvent={orderEvent} />
      ))}
    </div>
  );
};

const getServerSidePageProps: DecoratedGetServerSideProps = async ({
  locale,
  res,
  queryClient,
}) => {
  await queryClient.fetchQuery({
    queryKey: getGetOrderEventHistoryCollectionQueryKey({}),
    queryFn: () =>
      getOrderEventHistoryCollection(
        {},
        { headers: { "Accept-Language": nextLangToSyliusLocale(locale) } },
      ),
  });

  res.setHeader(
    "CDN-Cache-Control",
    `max-age=${CACHE_DURATIONS_IN_SECONDS.FIVE_SECONDS}, stale-while-revalidate=${CACHE_DURATIONS_IN_SECONDS.FIVE_SECONDS}`,
  );

  return { props: {} };
};

export const getServerSideProps = withCommonPagePropsDecorator(getServerSidePageProps);

export default Page;
