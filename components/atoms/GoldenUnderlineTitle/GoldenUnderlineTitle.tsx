import styles from "./GoldenUnderlineTitle.module.scss";

type Props = {
  size?: "medium" | "large";
};
const GoldenUnderlineTitle = ({ size = "medium" }: Props) => {
  return <div className={styles[size]}></div>;
};

export default GoldenUnderlineTitle;
