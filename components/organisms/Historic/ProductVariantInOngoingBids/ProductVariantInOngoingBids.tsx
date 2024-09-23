import Image from "next/image";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { PLPIndexName } from "@/hooks/useAlgoliaRefinements";
import {
  GetCustomerAuctionItemsCustomerAuctionItemDTOCollection200,
  GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue,
} from "@/networking/sylius-api-client/.ts.schemas";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import OngoingBids from "../DisplayProductHistory/OngoingBids/OngoingBids";
import styles from "./ProductVariantInOngoingBids.module.scss";

type Props = {
  productVariants: GetCustomerAuctionItemsCustomerAuctionItemDTOCollection200 | undefined;
  isError: boolean;
  setSort: (sort: GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionSortValue) => void;
};

const ProductVariantInOngoingBids = ({ productVariants, isError, setSort }: Props) => {
  const { t, lang } = useTranslation("historique");

  if (isError) return <div>{t("common:common.errorOccurred")}</div>;

  if (!productVariants) return null;

  if (productVariants["hydra:totalItems"] === 0)
    return (
      <div className={styles.box}>
        <Image src="/cartons.jpg" alt="Hammer" width={125} height={125} />
        <div className={styles.message}>
          {t("noOngoingAuction").toLocaleUpperCase()}
          <LinkButton
            href={getPlpUrl(
              { isDirectPurchase: ["false"], sortBy: [`${PLPIndexName}_price_desc`] },
              lang,
            )}
            dontTranslate={true}
            className={styles.btnBackToAuctions}
            variant="primaryBlack"
          >
            {t("orderHistory.btnViewCurrentAuctions")}
          </LinkButton>
        </div>
      </div>
    );

  return <OngoingBids setSort={setSort} productVariants={productVariants["hydra:member"]} />;
};

export const getStaticProps = getCommonPageStaticProps;

export default ProductVariantInOngoingBids;
