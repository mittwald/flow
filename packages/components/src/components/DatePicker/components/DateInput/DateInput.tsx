import type { FC } from "react";
import React from "react";
import styles from "./DateInput.module.scss";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { IconDate } from "@/components/Icon/components/icons";

export interface DateInputProps {
  isDisabled?: boolean;
}

export const DateInput: FC<DateInputProps> = (props) => {
  const { isDisabled } = props;

  return (
    <Aria.Group className={styles.dateInput}>
      <Aria.DateInput>
        {(segment) => <Aria.DateSegment segment={segment} />}
      </Aria.DateInput>
      <Button variant="plain" color="secondary" isDisabled={isDisabled}>
        <IconDate />
      </Button>
    </Aria.Group>
  );
};

export default DateInput;
