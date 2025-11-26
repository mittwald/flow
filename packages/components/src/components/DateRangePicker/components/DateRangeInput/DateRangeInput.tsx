import type { FC } from "react";
import React from "react";
import styles from "./DateRangeInput.module.scss";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { IconDate } from "@/components/Icon/components/icons";
import DateInput from "@/components/DateInput";

export interface DateInputProps {
  isDisabled?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

export const DateRangeInput: FC<DateInputProps> = (props) => {
  const { isDisabled, ref } = props;

  return (
    <Aria.Group className={styles.dateRangeInput}>
      <div>
        <DateInput slot="start" ref={ref} />
        <span aria-hidden="true">–</span>
        <DateInput slot="end" />
      </div>
      <Button variant="plain" color="secondary" isDisabled={isDisabled}>
        <IconDate />
      </Button>
    </Aria.Group>
  );
};

export default DateRangeInput;
