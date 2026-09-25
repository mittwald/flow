"use client";
import {
  Button,
  Popover,
  PopoverTrigger,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Section>
      <PopoverTrigger>
        <Button>Show battle station status</Button>
        <Popover>
          <Text>The Death Star is fully operational.</Text>
        </Popover>
      </PopoverTrigger>
    </Section>
  );
}
