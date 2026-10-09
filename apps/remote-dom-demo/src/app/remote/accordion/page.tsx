"use client";
import {
  Accordion,
  AccordionGroup,
  Badge,
  Content,
  Heading,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [expandedKeys, setExpandedKeys] = useState<Iterable<string | number>>([
    "fleet",
  ]);

  return (
    <>
      <Section>
        <Heading>Single expanded, controlled</Heading>
        <Text>Expanded: {[...expandedKeys].join(", ") || "none"}</Text>
        <AccordionGroup
          allowsMultipleExpanded={false}
          expandedKeys={expandedKeys}
          onExpandedChange={setExpandedKeys}
        >
          <Accordion id="fleet">
            <Heading level={3}>
              Fleet
              <Badge>12 ships</Badge>
            </Heading>
            <Content>
              <Text>Star Destroyers, TIE fighters and shuttles.</Text>
            </Content>
          </Accordion>
          <Accordion id="stations">
            <Heading level={3}>Stations</Heading>
            <Content>
              <Text>The Death Star and its outposts.</Text>
            </Content>
          </Accordion>
        </AccordionGroup>
      </Section>

      <Section>
        <Heading>Text headers without separators</Heading>
        <AccordionGroup separators={false}>
          <Accordion defaultExpanded>
            <Text>Advanced settings</Text>
            <Content>
              <Text>Settings most crews never need.</Text>
            </Content>
          </Accordion>
          <Accordion>
            <Text>
              Experimental features
              <Badge>Beta</Badge>
            </Text>
            <Content>
              <Text>Features that may still change.</Text>
            </Content>
          </Accordion>
        </AccordionGroup>
      </Section>
    </>
  );
}
