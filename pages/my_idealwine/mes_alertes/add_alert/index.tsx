import { sendGTMEvent } from "@next/third-parties/google";
import { useDebouncedEffect, useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { AlertsSearchResultCard } from "@/components/organisms/AlertsSearchResultCard/AlertsSearchResultCard";
import CreateAvailabilityAlertDialog from "@/components/organisms/CreateAvailabilityAlertDialog";
import TabsMenu, { ALERTS_TAB, AlertsTabs } from "@/components/organisms/TabsMenu/TabsMenu";
import {
  ProductJsonldColor,
  ProductJsonldShopProductRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetProductCollection } from "@/networking/sylius-api-client/product/product";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNotBlank, isNotNullNorUndefined, ObjectKeys } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const isProductColor = (productColor: string | null): productColor is ProductJsonldColor => {
  if (productColor === null) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(ProductJsonldColor, productColor);
};

const Page = (): JSX.Element => {
  const ALL_COLOR_OPTION = "all";

  const { t } = useTranslation("alerts");
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const productVintageYear = searchParams.get("productVintageYear") ?? undefined;
  const productColor = searchParams.get("productColor");
  const enumColor = isProductColor(productColor) ? productColor : ProductJsonldColor.null;

  const [search, setSearch] = useState("");
  const [color, setColor] = useState<ProductJsonldColor>(enumColor);
  const [selectedProduct, setSelectedProduct] = useState<ProductJsonldShopProductRead | null>();
  const alertProductId = selectedProduct?.id ?? productId;
  const isOpen = isNotBlank(productId) ? true : false;

  const [open, setOpen] = useState(isOpen);
  // Why not a `useDebouncedState` ? We need to reflect immediately the search value in the input
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useDebouncedEffect(() => setDebouncedSearch(search), [search], 500);

  const searchNow = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDebouncedSearch(search);
  };

  const showResults = debouncedSearch !== "";

  const {
    data: products,
    isError,
    isPreviousData,
    isLoading,
  } = useShopGetProductCollection(
    { "translations.name": debouncedSearch, color: color?.toString() },
    { query: { enabled: showResults, keepPreviousData: true } },
  );

  const getSelectOptions = () => {
    const options = ObjectKeys(ProductJsonldColor)
      .filter(
        optionColor =>
          ProductJsonldColor[optionColor] !== null &&
          optionColor !== ProductJsonldColor.INDIFFERENT,
      )
      .map(optionColor => ({
        value: optionColor,
        label: t(`color.${optionColor}`),
      }));

    return [
      {
        value: ALL_COLOR_OPTION,
        label: t(`add-alert.select-color`),
      },
      ...options,
    ];
  };

  useMountEffect(() => {
    sendGTMEvent({
      page: "add_alert",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.add.title")} description={t("seo.add.description")} />
      <TabsMenu tabs={AlertsTabs} currentTab={ALERTS_TAB.ADD_ALERT_URL} activeTabIsTitle />

      <form className={styles.pageBlock} onSubmit={searchNow}>
        <h2>{t("add-alert.search-word")}</h2>
        <div className={styles.searchBlock}>
          <Input
            placeholder={t("add-alert.search")}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            placeholder={t("add-alert.select-color")}
            value={color === ProductJsonldColor.null ? ALL_COLOR_OPTION : color}
            onValueChange={(value: string) =>
              setColor(
                value === ALL_COLOR_OPTION
                  ? ProductJsonldColor.null
                  : (value as ProductJsonldColor),
              )
            }
            options={{
              groups: [
                {
                  key: t("add-alert.select-color"),
                  options: getSelectOptions(),
                },
              ],
            }}
          />
        </div>
        <Button type="submit">{t("add-alert.search")}</Button>
      </form>

      {isError && <div className={styles.centered}>{t("add-alert.error")}</div>}

      {(isPreviousData || isLoading) && showResults && (
        <div className={styles.centered}>{t("add-alert.loading")}</div>
      )}

      {isNotNullNorUndefined(products) &&
        isNotNullNorUndefined(products["hydra:totalItems"]) &&
        products["hydra:totalItems"] === 0 &&
        debouncedSearch !== "" && (
          <div className={styles.centered}>
            {t("add-alert.no-results", {
              search: debouncedSearch,
            })}
          </div>
        )}

      {showResults && (
        <ul className={styles.searchResultsList}>
          {products?.["hydra:member"].map(product => (
            <li key={product.id}>
              <AlertsSearchResultCard
                product={product}
                setOpen={setOpen}
                setSelectedProduct={setSelectedProduct}
              />
            </li>
          ))}
        </ul>
      )}
      {isNotNullNorUndefined(alertProductId) && (
        <CreateAvailabilityAlertDialog
          productId={String(alertProductId)}
          vintageYear={productVintageYear}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
