import React, { FC } from "react";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import styles from "./Calendar.module.css";
import { Icon } from "@/components/Icon";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

export const Calendar: FC = () => {
  const headerElement = (
    <header>
      <Button slot="previous" variant="transparent">
        <Icon faIcon={faChevronLeft} />
      </Button>
      <Aria.Heading />
      <Button slot="next" variant="transparent">
        <Icon faIcon={faChevronRight} />
      </Button>
    </header>
  );

  const calendarElement = (
    <Aria.CalendarGrid>
      {(date) => <Aria.CalendarCell date={date} />}
    </Aria.CalendarGrid>
  );

  return (
    <Aria.Calendar className={styles.root}>
      {headerElement}
      {calendarElement}
    </Aria.Calendar>
  );
};

export default Calendar;
