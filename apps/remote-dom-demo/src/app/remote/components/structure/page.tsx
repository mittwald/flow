"use client";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
import {
  AccentBox,
  Accordion,
  AccordionGroup,
  Avatar,
  Badge,
  Button,
  ColumnLayout,
  Combine,
  Content,
  Flex,
  Heading,
  Initials,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  Option,
  Popover,
  PopoverTrigger,
  Section,
  Select,
  Separator,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  TabTitle,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [expandedKeys, setExpandedKeys] = useState<Iterable<string>>(["fleet"]);

  return (
    <ComponentGroupPage title="Structure">
      <Section>
        <Heading level={3}>AccentBox</Heading>
        <AccentBox backgroundColor="blue">
          <Section>
            <Heading level={4}>Join the Rebel Alliance</Heading>
            <Text>We need pilots, engineers and droids with spirit.</Text>
            <Link href="#">Sign up</Link>
          </Section>
        </AccentBox>
      </Section>

      <Section>
        <Heading level={3}>Accordion</Heading>
        <Accordion>
          <Text>
            Experimental features
            <Badge>Beta</Badge>
          </Text>
          <Content>
            <Text>Features that may still change.</Text>
          </Content>
        </Accordion>
      </Section>

      <Section>
        <Heading level={3}>AccordionGroup</Heading>
        <Text>Expanded: {[...expandedKeys].join(", ") || "none"}</Text>
        <AccordionGroup
          allowsMultipleExpanded={false}
          expandedKeys={expandedKeys}
          onExpandedChange={setExpandedKeys}
        >
          <Accordion id="fleet">
            <Heading level={4}>
              Fleet
              <Badge>12 ships</Badge>
            </Heading>
            <Content>
              <Text>Star Destroyers, TIE fighters and shuttles.</Text>
            </Content>
          </Accordion>
          <Accordion id="stations">
            <Heading level={4}>Stations</Heading>
            <Content>
              <Text>The Death Star and its outposts.</Text>
            </Content>
          </Accordion>
        </AccordionGroup>
      </Section>

      <Section>
        <Heading level={3}>ColumnLayout</Heading>
        <ColumnLayout>
          <LabeledValue>
            <Label>Pilot</Label>
            <Content>Luke Skywalker</Content>
          </LabeledValue>
          <LabeledValue>
            <Label>Ship</Label>
            <Content>X-wing</Content>
          </LabeledValue>
          <LabeledValue>
            <Label>Squadron</Label>
            <Content>Red Five</Content>
          </LabeledValue>
        </ColumnLayout>
      </Section>

      <Section>
        <Heading level={3}>Combine</Heading>
        <Combine>
          <Avatar>
            <Initials>Leia Organa</Initials>
          </Avatar>
          <Text>
            <strong>Leia Organa</strong>
            General
          </Text>
        </Combine>
      </Section>

      <Section>
        <Heading level={3}>Flex</Heading>
        <Flex gap="m" align="center">
          <Button>Launch</Button>
          <Text>All systems go.</Text>
        </Flex>
      </Section>

      <Section>
        <Heading level={3}>LayoutCard</Heading>
        <LayoutCard>
          <Text>Hangar bay 94</Text>
        </LayoutCard>
      </Section>

      <Section>
        <Heading level={3}>Section</Heading>
        <Section>
          <Heading level={4}>Mission briefing</Heading>
          <Text>Destroy the shield generator on Endor.</Text>
        </Section>
      </Section>

      <Section>
        <Heading level={3}>Separator</Heading>
        <Text>Light side</Text>
        <Separator />
        <Text>Dark side</Text>
      </Section>

      <Section>
        <Heading level={3}>Table</Heading>
        <Table aria-label="Fleet">
          <TableHeader>
            <TableColumn>Ship</TableColumn>
            <TableColumn>Class</TableColumn>
            <TableColumn>Crew</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Millennium Falcon</TableCell>
              <TableCell>Light freighter</TableCell>
              <TableCell>4</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>X-wing</TableCell>
              <TableCell>Starfighter</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section>
        <Heading level={3}>Tabs</Heading>
        {/* An inactive tab is deactivated, not unmounted: it keeps its state,
            but must not leave an overlay on screen. */}
        <Tabs aria-label="Hangar bay">
          <Tab id="manifest">
            <TabTitle>Manifest</TabTitle>
            <Section>
              <Text>
                Type a name, switch to the paint job and come back. The entry is
                still there.
              </Text>
              <TextField>
                <Label>Freighter name</Label>
              </TextField>
            </Section>
          </Tab>
          <Tab id="paint">
            <TabTitle>Paint job</TabTitle>
            <Section>
              <Text>
                Open the hull colour list or the notes, then double-click the
                manifest tab. Neither overlay may survive the switch.
              </Text>
              <Select>
                <Label>Hull colour</Label>
                <Option>Imperial grey</Option>
                <Option>Rebel orange</Option>
                <Option>Corellian red</Option>
              </Select>
              <PopoverTrigger>
                <Button>Hangar notes</Button>
                <Popover>
                  <Text>Leave the tab while this is open.</Text>
                </Popover>
              </PopoverTrigger>
            </Section>
          </Tab>
        </Tabs>
      </Section>
    </ComponentGroupPage>
  );
}
