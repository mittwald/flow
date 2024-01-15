import React, { FC } from "react";
import { useDateFormatter } from "react-aria";

export interface DateValueProps {
  format?: "date" | "dateTime";
  value: Date;
}

export const DateValue: FC<DateValueProps> = (props) => {
  const { value, format = "date" } = props;

  const formatter = useDateFormatter({
    dateStyle: "short",
    timeStyle: format === "dateTime" ? "short" : undefined,
  });

  return <>{formatter.format(value)}</>;
};

export default DateValue;
