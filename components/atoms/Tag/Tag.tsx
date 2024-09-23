import clsx from "clsx";

import styles from "./Tag.module.scss";

type Props = {
  text: string;
  className?: string;
};

const Tag = ({ className, text }: Props): JSX.Element => {
  return <span className={clsx(styles.tag, className)}>{text}</span>;
};

export default Tag;
