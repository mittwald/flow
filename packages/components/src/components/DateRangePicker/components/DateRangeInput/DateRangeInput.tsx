import React, { FC } from "react";
import styles from "./DateRangeInput.module.scss";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons/faCalendarDays";

export interface DateInputProps {
  isDisabled?: boolean;
}

export const DateRangeInput: FC<DateInputProps> = (props) => {
  const { isDisabled } = props;

  return (
    <Aria.Group className={styles.dateRangeInput}>
      <Aria.DateInput slot="start">
        {(segment) => <Aria.DateSegment segment={segment} />}
      </Aria.DateInput>
      <span aria-hidden="true">–</span>
      <Aria.DateInput slot="end">
        {(segment) => <Aria.DateSegment segment={segment} />}
      </Aria.DateInput>
      <Button variant="plain" isDisabled={isDisabled}>
        <Icon faIcon={faCalendarDays} />
      </Button>
    </Aria.Group>
  );
};

export default DateRangeInput;
