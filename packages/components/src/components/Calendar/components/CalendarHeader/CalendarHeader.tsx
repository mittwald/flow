import type { FC } from "react";
import React from "react";
import { Button } from "@/components/Button";
import * as Aria from "react-aria-components";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/Icon/components/icons";

export const CalendarHeader: FC = () => {
  return (
    <header>
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
