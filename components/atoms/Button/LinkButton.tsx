import clsx from "clsx";

import TranslatableLink, {
  TranslatableLinkProps,
} from "@/components/atoms/TranslatableLink/TranslatableLink";

import styles from "./Button.module.scss";

type Props = {
  variant?:
    | "primaryGolden"
    | "secondaryGolden"
    | "primaryBlack"
    | "primaryWhite"
    | "secondaryBlack"
    | "secondaryWhite"
    | "inline";
  className?: string;
  children: React.ReactNode;
  href: string;
} & TranslatableLinkProps;

const LinkButton = ({
  variant = "primaryGolden",
  className,
  children,
  href,
  ...props
}: Props): JSX.Element => {
  return (
    <TranslatableLink
      {...props}
      href={href}
      className={clsx(styles.button, styles.linkButton, styles[variant], className)}
    >
      {children}
    </TranslatableLink>
  );
};

export default LinkButton;
