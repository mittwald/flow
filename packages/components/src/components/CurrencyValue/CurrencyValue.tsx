import React, { FC } from "react";
import { useNumberFormatter } from "react-aria";

export interface CurrencyValueProps {
  currency?: string;
  value: number;
}

export const CurrencyValue: FC<CurrencyValueProps> = (props) => {
  const { value, currency = "EUR" } = props;

  const formatter = useNumberFormatter({
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  return <>{formatter.format(value)}</>;
};

export default CurrencyValue;
