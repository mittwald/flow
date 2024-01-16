import React, { FC } from "react";
import { useDateFormatter } from "react-aria";

export interface DateValueProps {
  /** @default "date" */
  format?: "date" | "dateTime" | "time";
  value: Date;
}

export const DateValue: FC<DateValueProps> = (props) => {
  const { value, format = "date" } = props;

  const formatter = useDateFormatter({
    dateStyle: format !== "time" ? "short" : undefined,
    timeStyle: format !== "date" ? "short" : undefined,
  });

  return <>{formatter.format(value)}</>;
};

export default DateValue;
