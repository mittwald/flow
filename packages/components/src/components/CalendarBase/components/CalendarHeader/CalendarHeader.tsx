import React, { FC } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import * as Aria from "react-aria-components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

export const CalendarHeader: FC = () => {
  return (
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
};

export default CalendarHeader;
