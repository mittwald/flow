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
        <Button>Show battle station status</Button>
        <Popover>
          <>The Death Star is fully operational.</>
        </Popover>
      </PopoverTrigger>
    </Section>
  );
}
