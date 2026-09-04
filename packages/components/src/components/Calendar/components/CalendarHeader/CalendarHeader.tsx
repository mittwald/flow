import type { FC } from "react";
import { Button } from "@/components/Button";
import * as Aria from "react-aria-components";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/Icon/components/icons";
import styles from "../../Calendar.module.scss";

export const CalendarHeader: FC = () => {
  return (
    <header className={styles.calendarHeader}>
      <Button ariaSlot="previous" variant="plain" color="secondary">
        <IconChevronLeft />
      </Button>
      <Aria.Heading />
      <Button ariaSlot="next" variant="plain" color="secondary">
        <IconChevronRight />
      </Button>
    </header>
  );
};

export default CalendarHeader;
