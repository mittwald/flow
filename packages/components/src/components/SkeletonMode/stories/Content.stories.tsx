import type { Meta, StoryObj } from "@storybook/react";
import SkeletonMode from "../SkeletonMode";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Label } from "@/components/Label";
import { Align } from "@/components/Align";
import { ColumnLayout } from "@/components/ColumnLayout";
import { Kbd } from "@/components/Kbd";
import { AvatarStack } from "@/components/AvatarStack";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { FileCard } from "@/components/FileCard";
import { FileCardList } from "@/components/FileCardList";
import { CodeBlock } from "@/components/CodeBlock";
import { Markdown } from "@/components/Markdown";
import { CodeEditor } from "@/components/CodeEditor";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { CartesianChart, Bar, XAxis, YAxis } from "@/components/CartesianChart";
import { DonutChart } from "@/components/DonutChart";
import { RangeCalendar } from "@/components/Calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Modal } from "@/components/Modal";
import { Content } from "@/components/Content";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";

const nginxConfig = `server {
  listen 443 ssl;
  server_name webshop.example-domain.de;
}`;

const meta: Meta<typeof SkeletonMode> = {
  title: "Content/SkeletonMode/Content",
  component: SkeletonMode,
  args: {
    isEnabled: true,
  },
  render: (props) => (
    <SkeletonMode {...props}>
      <Section>
        <Heading>Webshop Relaunch</Heading>
        <Align>
          <Text>Suche öffnen mit</Text>
          <Kbd keys={["mod", "k"]} variant="soft" />
          <AvatarStack totalCount={5} onCountPress={() => undefined}>
            <Avatar>
              <Initials>Max Mustermann</Initials>
            </Avatar>
            <Avatar>
              <Initials>Erika Musterfrau</Initials>
            </Avatar>
          </AvatarStack>
        </Align>
        <FileCardList>
          <FileCard
            name="rechnung-2026-09.pdf"
            type="application/pdf"
            sizeInBytes={123456}
            onDelete={() => undefined}
          />
        </FileCardList>
        <CodeBlock code={nginxConfig} />
        <Markdown>
          {
            "Stelle vor dem Umzug den **Nameserver** um.\n\n- Zone exportieren\n- Zone importieren"
          }
        </Markdown>
        <ColumnLayout m={[2, 1]}>
          <CartesianChart
            height="180px"
            data={[
              { month: "Juli", requests: 1200 },
              { month: "August", requests: 1800 },
            ]}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="requests" />
          </CartesianChart>
          <DonutChart value={70} aria-label="Speicherplatz" />
        </ColumnLayout>
        <CodeEditor value={nginxConfig}>
          <Label>Konfiguration</Label>
        </CodeEditor>
        <MarkdownEditor rows={3}>
          <Label>Hinweis für das Team</Label>
        </MarkdownEditor>
        <RangeCalendar aria-label="Zeitraum" />
        <Table aria-label="Zertifikate">
          <TableHeader>
            <TableColumn>Domain</TableColumn>
            <TableColumn>Gültig bis</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>webshop.example-domain.de</TableCell>
              <TableCell>12.01.2027</TableCell>
            </TableRow>
          </TableBody>
        </Table>
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

export const OpenModal: Story = {
  render: (props) => (
    <SkeletonMode {...props}>
      <Modal isDefaultOpen showCloseButton>
        <Heading>Domain umziehen</Heading>
        <Content>
          <Text>
            Die Domain webshop.example-domain.de wird in das Projekt „Webshop
            Relaunch“ umgezogen.
          </Text>
        </Content>
        <ActionGroup>
          <Button color="secondary" variant="soft">
            Abbrechen
          </Button>
          <Button>Umziehen</Button>
        </ActionGroup>
      </Modal>
    </SkeletonMode>
  ),
};
