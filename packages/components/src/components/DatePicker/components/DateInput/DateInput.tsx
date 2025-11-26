import { type FC, type Ref } from "react";
import styles from "./DateInput.module.scss";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { IconDate } from "@/components/Icon/components/icons";
import Input from "@/components/DateInput";

export interface DateInputProps {
  isDisabled?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

export const DateInput: FC<DateInputProps> = (props) => {
  const { isDisabled, ref } = props;

  return (
    <Aria.Group className={styles.dateInput}>
      <Input ref={ref} />
      <Button variant="plain" color="secondary" isDisabled={isDisabled}>
        <IconDate />
      </Button>
    </Aria.Group>
  );
};

export default DateInput;
