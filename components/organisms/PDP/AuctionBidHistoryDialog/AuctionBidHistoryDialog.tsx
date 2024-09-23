import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";

import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import Modal from "@/components/molecules/Modal";
import Price from "@/components/molecules/Price";
import { AuctionWinningBidJsonldShopAuctionItemDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { transformDateToEuropeanFormat } from "@/utils/datesHandler";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./AuctionBidHistoryDialog.module.scss";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  historicWinningBids: AuctionWinningBidJsonldShopAuctionItemDtoRead[];
};

const LOYALTY_PROGRAM_LOGO_PATH = {
  NONE: "/loyaltyProgramCrowns/standard.svg",
  QUINTESSENCE: "/loyaltyProgramCrowns/quintessence.svg",
  IDEAL: "/loyaltyProgramCrowns/ideal.svg",
  PRIVILEGE: "/loyaltyProgramCrowns/privilege.svg",
};

const AuctionBidHistoryDialog = ({ open, setOpen, historicWinningBids }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Dialog.Title className={styles.title}>{t("auction_bid_history_dialog.title")}</Dialog.Title>
      <div className={styles.dialogContainer}>
        <span className={styles.description}>
          {t("auction_bid_history_dialog.description")}
          <TranslatableLink href="FAQ_URL" className={styles.learnMoreLink}>
            {t("auction_bid_history_dialog.learnMoreOnAuctions")}
          </TranslatableLink>
        </span>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("auction_bid_history_dialog.bidder")}</th>
                <th>{t("auction_bid_history_dialog.bidAmount")}</th>
                <th>{t("auction_bid_history_dialog.bidDate")}</th>
              </tr>
            </thead>
            <tbody>
              {historicWinningBids
                .slice(0)
                .reverse() // Reverse the array to have the most recent bid at the top
                .map((bid, index) => {
                  const loyaltyProgram = bid.shopUser?.customer?.loyaltyProgram ?? "NONE";
                  const loyaltyProgramLogo = LOYALTY_PROGRAM_LOGO_PATH[loyaltyProgram];
                  const bidPrice = isNotNullNorUndefined(bid.price) ? bid.price : 0;

                  return (
                    <tr key={index}>
                      <td>
                        {bid.shopUser?.username}
                        <Image
                          className={styles.picto}
                          src={loyaltyProgramLogo}
                          alt={`Programme de loyauté de l'utilisateur: ${loyaltyProgram}`}
                          width={18}
                          height={12}
                        />
                      </td>
                      <td>
                        <Price size="small" price={bidPrice} />
                      </td>
                      {isNotNullNorUndefined(bid.createdAt) && (
                        <td>{transformDateToEuropeanFormat(bid.createdAt, "long")}</td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default AuctionBidHistoryDialog;
