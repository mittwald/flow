import React, { FC } from "react";
import styles from "./DateInput.module.css";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons/faCalendarDays";
import { InputGroup } from "@/components/InputGroup";

export interface DateInputProps {
  isDisabled?: boolean;
  range?: boolean;
}

export const DateInput: FC<DateInputProps> = (props) => {
  const { isDisabled, range } = props;

  const dateElement = (
    <Aria.DateInput>
      {(segment) => <Aria.DateSegment segment={segment} />}
    </Aria.DateInput>
  );

  const dateRangeElement = (
    <>
      <Aria.DateInput slot="start">
        {(segment) => <Aria.DateSegment segment={segment} />}
      </Aria.DateInput>
      <span aria-hidden="true">–</span>
      <Aria.DateInput slot="end">
        {(segment) => <Aria.DateSegment segment={segment} />}
      </Aria.DateInput>
    </>
  );

  return (
    <InputGroup className={styles.root}>
      {range ? dateRangeElement : dateElement}
      <Button variant="transparent" isDisabled={isDisabled}>
        <Icon faIcon={faCalendarDays} />
      </Button>
    </InputGroup>
  );
};

export default DateInput;
