import type { Meta, StoryObj } from "@storybook/react";
import SkeletonMode from "../SkeletonMode";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { Label } from "@/components/Label";
import { LabeledValue } from "@/components/LabeledValue";
import { InlineCode } from "@/components/InlineCode";
import { AlertText } from "@/components/AlertText";
import { BigNumber } from "@/components/BigNumber";
import { ColumnLayout } from "@/components/ColumnLayout";
import { Content } from "@/components/Content";

const meta: Meta<typeof SkeletonMode> = {
  title: "Content/SkeletonMode",
  component: SkeletonMode,
  args: {
    isEnabled: true,
  },
  render: (props) => (
    <SkeletonMode {...props}>
      <Section>
        <Heading>Projekt „Webshop Relaunch“</Heading>
        <Text>
          Das Projekt liegt auf dem Server <InlineCode>p-4711</InlineCode> und
          ist unter <Link href="#">webshop.example-domain.de</Link> erreichbar.
          Die Daten werden jede Nacht gesichert.
        </Text>
        <ColumnLayout m={[1, 1, 1]}>
          <LabeledValue>
            <Label>Speicherplatz</Label>
            <Content>20 GB</Content>
          </LabeledValue>
          <LabeledValue>
            <Label>PHP-Version</Label>
            <Content>8.4</Content>
          </LabeledValue>
          <BigNumber>
            <Text>42</Text>
            <Text>Domains</Text>
          </BigNumber>
        </ColumnLayout>
        <AlertText status="warning">Das Zertifikat läuft bald ab.</AlertText>
      </Section>
    </SkeletonMode>
  ),
};

export default meta;

type Story = StoryObj<typeof SkeletonMode>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    isEnabled: false,
  },
};

export const WithoutContent: Story = {
  render: (props) => (
    <SkeletonMode {...props}>
      <Section>
        <Heading />
        <Text />
        <Label />
      </Section>
    </SkeletonMode>
  ),
};

export const NestedOptOut: Story = {
  render: (props) => (
    <SkeletonMode {...props}>
      <Section>
        <SkeletonMode isEnabled={false}>
          <Heading>Speicherplatz</Heading>
        </SkeletonMode>
        <Text>Belegt sind 12,4 GB von 20 GB.</Text>
      </Section>
    </SkeletonMode>
  ),
};
