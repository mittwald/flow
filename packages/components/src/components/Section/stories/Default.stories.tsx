import type { Meta, StoryObj } from "@storybook/react";
import Section from "../Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { Switch } from "@/components/Switch";
import { AlertBadge } from "@/components/AlertBadge";
import Header from "@/components/Header";
import { IconContextMenu } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";
import { dummyText } from "@/lib/dev/dummyText";
import { Action } from "@/components/Action";
import { Modal, ModalTrigger } from "@/components/Modal";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import ContextMenuTrigger from "@/components/ContextMenu/components/ContextMenuTrigger";
import { ContextMenu } from "@/components/ContextMenu";
import MenuItem from "@/components/MenuItem";
import { FileField } from "@/components/FileField";
import Content from "@/components/Content";
import ActionGroup from "@/components/ActionGroup";
import { Badge } from "@/components/Badge";
import Alert from "@/components/Alert";

const meta: Meta<typeof Section> = {
  title: "Structure/Section",
  component: Section,
  argTypes: { hideSeparator: { control: "boolean" } },
  render: (props) => (
    <Section {...props}>
      <Heading>Rebel Alliance Briefing</Heading>
      <Text>
        Fleet movements, secret mission dispatches and intel from across the
        galaxy - we bring the most important transmissions straight to your
        comlink. Join the Alliance briefing and stay one step ahead of the
        Empire.
      </Text>
      <Link href="#">Join the Alliance</Link>
    </Section>
  ),
  args: { hideSeparator: false },
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {
  parameters: {
    controls: { disable: true },
  },
};

export const WithHeaderActionGroup: Story = {
  render: (props) => (
    <Section {...props}>
      <Header>
        <Heading>Project settings</Heading>
        <ActionGroup>
          <Button variant="soft" color="secondary">
            Cancel
          </Button>
          <Button color="accent">Save</Button>
        </ActionGroup>
      </Header>
      <Text>{dummyText.medium}</Text>
    </Section>
  ),
};

export const MultipleSections: Story = {
  render: (props) => (
    <>
      <Alert>
        <Heading>Transmission from Alliance High Command</Heading>
      </Alert>
      <Section {...props}>
        <Header>
          <Heading>
            Rebel Alliance Briefing <Badge>Subscribed</Badge>
          </Heading>

          <Switch defaultSelected>Transmissions</Switch>
          <ContextualHelpTrigger>
            <Button />
            <ContextualHelp>
              Additional information about the fleet rendezvous
            </ContextualHelp>
          </ContextualHelpTrigger>
        </Header>
        <Text>
          Fleet movements, secret mission dispatches and intel from across the
          galaxy - we bring the most important transmissions straight to your
          comlink. Join the Alliance briefing and stay one step ahead of the
          Empire.
        </Text>
      </Section>
      <Section {...props}>
        <Header>
          <Heading>
            Project Stardust
            <AlertBadge status="danger">Deactivated</AlertBadge>
          </Heading>
          <ModalTrigger>
            <Button color="danger">Decommission project</Button>
            <Modal>
              <Heading>Decommission project</Heading>
              <Content>
                <Text>Are you sure you want to decommission this project?</Text>
              </Content>
              <ActionGroup>
                <Action closeModal>
                  <Button color="danger">Decommission project</Button>
                  <Button variant="soft" color="secondary">
                    Abort
                  </Button>
                </Action>
              </ActionGroup>
            </Modal>
          </ModalTrigger>
          <FileField>
            <Button variant="soft" color="secondary">
              Import roster
            </Button>
          </FileField>
          <ContextMenuTrigger>
            <Button variant="soft" color="secondary" aria-label="More actions">
              <IconContextMenu />
            </Button>
            <ContextMenu>
              <MenuItem>Rename</MenuItem>
              <MenuItem>Archive</MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
        </Header>
        <Alert>
          <Heading>The plans are stored in the main computer</Heading>
        </Alert>
        <Text>{dummyText.long}</Text>
        <Heading level={3}>Mission Details</Heading>
        <Text>{dummyText.medium}</Text>
      </Section>
    </>
  ),
};
