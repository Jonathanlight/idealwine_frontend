import styles from "./FillableBar.module.scss";

type Props = {
  filledPercentage: number;
};

const FillableBar = ({ filledPercentage }: Props): JSX.Element => {
  return (
    <svg viewBox="0 0 100 4" preserveAspectRatio="none" className={styles.svg}>
      <path d="M 0,2 L 100,2" stroke="rgb(0,0,0,0.3)" strokeWidth="1" fillOpacity="0"></path>
      <path
        d="M 0,2 L 100,2"
        stroke="#a7813d"
        strokeWidth="1"
        fillOpacity="0"
        strokeDasharray="100, 100"
        strokeDashoffset={100 - filledPercentage}
      ></path>
    </svg>
  );
};

export default FillableBar;
