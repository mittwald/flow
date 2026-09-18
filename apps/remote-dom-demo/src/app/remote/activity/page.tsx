"use client";
import {
  Button,
  Heading,
  Label,
  Option,
  Popover,
  PopoverTrigger,
  Section,
  Select,
  Tab,
  Tabs,
  TabTitle,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Tabs aria-label="Hangar bay">
      <Tab id="manifest">
        <TabTitle>Manifest</TabTitle>
        <Section>
          <Heading>Manifest</Heading>
          <Text>
            Type a name, switch to the paint job and come back. The entry is
            still there: an inactive tab is deactivated, not unmounted, so the
            panel keeps its state.
          </Text>
          <TextField>
            <Label>Freighter name</Label>
          </TextField>
        </Section>
      </Tab>

      <Tab id="paint">
        <TabTitle>Paint job</TabTitle>
        <Section>
          <Heading>Paint job</Heading>
          <Text>
            Open the hull colour list, then double-click the manifest tab. The
            list must be gone: a deactivated panel keeps rendering but never
            commits again, so an overlay it left on screen would hang over the
            tab you switched to forever.
          </Text>
          <Select>
            <Label>Hull colour</Label>
            <Option>Imperial grey</Option>
            <Option>Rebel orange</Option>
            <Option>Corellian red</Option>
            <Option>Kessel rust</Option>
          </Select>
          <PopoverTrigger>
            <Button>Hangar notes</Button>
            <Popover>
              <>Leave the tab while this is open — it must not survive.</>
            </Popover>
          </PopoverTrigger>
        </Section>
      </Tab>
    </Tabs>
  );
}
