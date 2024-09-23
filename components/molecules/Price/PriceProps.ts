export type PriceProps = {
  price: number;
  size: "tinier" | "tiny" | "small" | "medium" | "normal" | "big";
  isDiscount?: boolean;
  isPrimeur?: boolean;
  strikethrough?: boolean;
  disabled?: boolean;
  doNotConvertPrice?: boolean;
  className?: string;
  forcedCurrency?: {
    code: string;
    ratio: number;
  };
  dontDisplayCents?: boolean;
};
