import Image from "next/image";

import styles from "./ProductVintageNoteCard.module.scss";

export const ProductVintageNoteCard = ({ note }: { note: [string, string] }): JSX.Element => {
  const [name, value] = note;

  return (
    <div className={styles.container}>
      <div className={styles.value}>{value}</div>
      <Image src={`/notes/${name}.jpg`} alt={`logo for ${name} note`} width={100} height={34} />
    </div>
  );
};

export default ProductVintageNoteCard;
