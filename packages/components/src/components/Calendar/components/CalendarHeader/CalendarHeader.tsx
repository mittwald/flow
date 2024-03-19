import React, { FC } from "react";
import { Button } from "@/components/Button";
import * as Aria from "react-aria-components";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/Icon/components/icons";

export const CalendarHeader: FC = () => {
  return (
    <header>
      <Button slot="previous" style="plain">
        <IconChevronLeft />
      </Button>
      <Aria.Heading />
      <Button slot="next" style="plain">
        <IconChevronRight />
      </Button>
    </header>
  );
};

export default CalendarHeader;
