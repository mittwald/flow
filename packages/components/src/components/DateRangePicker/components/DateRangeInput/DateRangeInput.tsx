import type { FC, SyntheticEvent } from "react";
import type React from "react";
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

  /* react-aria moves the focus between segments without scrolling, and typing
     changes the segment widths without moving the focus. On focus it has to
     run before react-aria's own handler: a segment that moves in the meantime
     makes react-aria center the field in the page. */
  const scrollFocusedSegmentIntoView = (event: SyntheticEvent) => {
    if (event.target instanceof Element) {
      event.target.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  };

  return (
    <Aria.Group className={styles.dateRangeInput}>
      <div
        className={styles.inputs}
        onFocusCapture={scrollFocusedSegmentIntoView}
        onKeyUp={scrollFocusedSegmentIntoView}
      >
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
