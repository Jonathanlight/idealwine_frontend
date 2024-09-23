import { QueryClient, useQuery } from "@tanstack/react-query";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import MobileVintageSagaDeck from "@/components/molecules/MobileVintageSagaDeck";
import VintageNotesTable from "@/components/molecules/VintageNotesTable";
import { VintageSagaTableBreadcrumb } from "@/components/organisms/Breadcrumb/VintageSagaTableBreadcrumb";
import {
  getGetTableVintageSagaCollectionQueryKey,
  getTableVintageSagaCollection,
} from "@/networking/sylius-api-client/vintage-saga/vintage-saga";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { DecoratedGetStaticProps, withCommonPagePropsDecorator } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("saga-millesime");

  const { data: vintageSagaData } = useQuery(getVintageSagaFrenchRegionsQueryParams());

  return (
    <div className={styles.mainContainer}>
      <VintageSagaTableBreadcrumb
        translatedLinkName={"VINTAGE_TABLE_NOTATION_URL"}
        vintageSagaTab={t("frenchWines")}
      />
      <h1 className={styles.mainTitle}>{t("vintageNotes")}</h1>
      <div className={styles.header}>
        <h2 className={styles.tableTitle}>{t("frenchRegionsTableTitle")}</h2>
        <TranslatableLink className={styles.link} href={"VINTAGE_TABLE_NOTATION_INT_URL"}>
          <Button variant="primaryGolden">{t("internationalWines")}</Button>
        </TranslatableLink>
      </div>
      {isNotNullNorUndefined(vintageSagaData) && (
        <>
          <VintageNotesTable
            vintageSagaData={vintageSagaData["hydra:member"]}
            variant="frenchRegions"
          />
          <MobileVintageSagaDeck
            vintageSagaData={vintageSagaData["hydra:member"]}
            variant="frenchRegions"
          />
        </>
      )}
    </div>
  );
};

const getVintageSagaFrenchRegionsQueryParams = () => ({
  staleTime: STALE_TIME_HOUR,
  queryKey: getGetTableVintageSagaCollectionQueryKey({ vintage_saga_french_regions: true }),
  queryFn: () => getTableVintageSagaCollection({ vintage_saga_french_regions: true }),
});

const cacheVintageSagaFrenchRegions = async (queryClient: QueryClient) => {
  try {
    await queryClient.fetchQuery(getVintageSagaFrenchRegionsQueryParams());
  } catch (error) {
    // an error occurred, the react query cache is not warmed up  }
  }
};

const getStaticPageProps: DecoratedGetStaticProps = async ({ queryClient }) => {
  await cacheVintageSagaFrenchRegions(queryClient);

  return {
    props: {},
  };
};

export const getStaticProps = withCommonPagePropsDecorator(getStaticPageProps);

export default Page;
