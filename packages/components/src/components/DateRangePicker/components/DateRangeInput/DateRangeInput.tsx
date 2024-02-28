import React, { FC } from "react";
import styles from "./DateRangeInput.module.scss";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { IconDate } from "@/components/Icon/components/icons";

export interface DateInputProps {
  isDisabled?: boolean;
}

export const DateRangeInput: FC<DateInputProps> = (props) => {
  const { isDisabled } = props;

  return (
    <Aria.Group className={styles.dateRangeInput}>
      <div>
        <Aria.DateInput slot="start">
          {(segment) => <Aria.DateSegment segment={segment} />}
        </Aria.DateInput>
        <span aria-hidden="true">–</span>
        <Aria.DateInput slot="end">
          {(segment) => <Aria.DateSegment segment={segment} />}
        </Aria.DateInput>
      </div>
      <Button style="plain" variant="secondary" isDisabled={isDisabled}>
        <IconDate />
      </Button>
    </Aria.Group>
  );
};

export default DateRangeInput;
