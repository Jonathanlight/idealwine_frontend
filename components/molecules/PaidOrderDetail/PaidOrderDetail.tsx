import styles from "./PaidOrderDetail.module.scss";
const PaidOrderDetail = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.orderInfoContainer}>
      <p className={styles.orderDetails}>{children}</p>
      <div className={styles.separator} />
    </div>
  );
};

export default PaidOrderDetail;
