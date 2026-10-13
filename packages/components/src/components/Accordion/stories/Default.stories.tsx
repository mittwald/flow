import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";
import { AlertBadge } from "@/components/AlertBadge";
import { Label } from "@/components/Label";

const meta: Meta<typeof Accordion> = {
  title: "Structure/Accordion",
  component: Accordion,
  args: { defaultExpanded: true },
  render: (props) => (
    <Accordion {...props}>
      <Heading>The Death Star</Heading>
      <Content>
        <Text>
          A moon-sized battle station of the Galactic Empire, armed with a
          superlaser capable of destroying an entire planet.
        </Text>
      </Content>
    </Accordion>
  ),
  parameters: {
    controls: { exclude: ["variant"] },
  },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const WithText: Story = {
  render: (props) => (
    <Accordion {...props}>
      <Text>Technical readout</Text>
      <Content>
        <Text>
          The thermal exhaust port is only two meters wide and leads directly to
          the reactor system.
        </Text>
      </Content>
    </Accordion>
  ),
};

export const WithLabel: Story = {
  render: (props) => (
    <Accordion {...props}>
      <Label>Docking bay 94</Label>
      <Content>
        <Text>The Millennium Falcon is cleared for departure.</Text>
      </Content>
    </Accordion>
  ),
};

export const WithBadges: Story = {
  render: (props) => (
    <Accordion {...props}>
      <Heading>
        Rebel fleet
        <Badge>30 ships</Badge>
        <AlertBadge status="warning">Under attack</AlertBadge>
      </Heading>
      <Content>
        <Text>
          X-wings and Y-wings are approaching the Death Star from the Yavin
          system.
        </Text>
      </Content>
    </Accordion>
  ),
};
