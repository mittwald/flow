import type { Meta, StoryObj } from "@storybook/react";
import { AccordionGroup } from "@/components/AccordionGroup";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import { AlertBadge } from "@/components/AlertBadge";
import { Section } from "@/components/Section";
import { LayoutCard } from "@/components/LayoutCard";
import { Flex } from "@/components/Flex";

const meta: Meta<typeof AccordionGroup> = {
  title: "Structure/AccordionGroup",
  component: AccordionGroup,
  args: {
    allowsMultipleExpanded: true,
    separators: true,
    defaultExpandedKeys: ["tatooine"],
  },
  parameters: {
    controls: { exclude: ["defaultExpandedKeys"] },
  },
  render: (props) => (
    <Section>
      <Heading level={2}>Planets</Heading>
      <AccordionGroup {...props}>
        <Accordion id="tatooine">
          <Heading>Tatooine</Heading>
          <Content>
            <Text>
              A desert planet with two suns in the Outer Rim, home of the
              Skywalker family and the Mos Eisley spaceport.
            </Text>
          </Content>
        </Accordion>
        <Accordion id="hoth">
          <Heading>Hoth</Heading>
          <Content>
            <Text>
              An ice planet that hid Echo Base until the Empire found it.
            </Text>
          </Content>
        </Accordion>
        <Accordion id="dagobah">
          <Heading>Dagobah</Heading>
          <Content>
            <Text>
              A swamp planet where Yoda lived in exile and trained Luke.
            </Text>
          </Content>
        </Accordion>
      </AccordionGroup>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof AccordionGroup>;

export const Default: Story = {};

const alert = <AlertBadge status="danger">Imperial presence</AlertBadge>;

export const WithText: Story = {
  args: { separators: false, defaultExpandedKeys: [] },
  render: (props) => (
    <LayoutCard style={{ maxWidth: 480 }}>
      <Section>
        <Heading>Sector report</Heading>
        <AccordionGroup {...props}>
          {["Outer Rim", "Mid Rim", "Core Worlds"].map((sector) => (
            <Accordion key={sector}>
              <Text>
                <Flex grow justify="space-between" align="center" gap="s">
                  {sector}
                  {alert}
                </Flex>
              </Text>
              <Content>
                <Text>Stormtroopers reported in several systems.</Text>
              </Content>
            </Accordion>
          ))}
        </AccordionGroup>
      </Section>
    </LayoutCard>
  ),
};
