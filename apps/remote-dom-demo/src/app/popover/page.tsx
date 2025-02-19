"use client";
import {
  Button,
  Popover,
  PopoverTrigger,
  Section,
} from "@mittwald/flow-remote-react-components";
import React from "react";

export default function Page() {
  return (
    <Section>
      <PopoverTrigger>
        <Button>Open</Button>
        <Popover>
          <>Popover content</>
        </Popover>
      </PopoverTrigger>
    </Section>
  );
}
