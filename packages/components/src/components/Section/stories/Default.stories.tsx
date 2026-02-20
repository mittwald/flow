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
import React from "react";
import Alert from "@/components/Alert";

const meta: Meta<typeof Section> = {
  title: "Structure/Section",
  component: Section,
  argTypes: { hideSeparator: { control: "boolean" } },
  render: (props) => (
    <Section {...props}>
      <Heading>Newsletter</Heading>
      <Text>
        Upcoming releases, new features and tips about your hosting - we bring
        the most important information to inbox. Subscribe to our newsletter and
        stay up to date.
      </Text>
      <Link href="#">Subscribe</Link>
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

export const MultipleSections: Story = {
  render: (props) => (
    <>
      <Alert>
        <Heading>Alert above sections</Heading>
      </Alert>
      <Section {...props}>
        <Header>
          <Heading>
            Newsletter <Badge>Subscribed</Badge>
          </Heading>

          <Switch defaultSelected>Subscription</Switch>
          <ContextualHelpTrigger>
            <Button />
            <ContextualHelp>
              Additional information about database migration
            </ContextualHelp>
          </ContextualHelpTrigger>
        </Header>
        <Text>
          Upcoming releases, new features and tips about your hosting - we bring
          the most important information to inbox. Subscribe to our newsletter
          and stay up to date.
        </Text>
      </Section>
      <Section {...props}>
        <Header>
          <Heading>
            My Project
            <AlertBadge status="danger">Deactivated</AlertBadge>
          </Heading>
          <ModalTrigger>
            <Button color="danger">Delete project</Button>
            <Modal>
              <Heading>Delete project</Heading>
              <Content>
                <Text>Are you sure you want to delete this project?</Text>
              </Content>
              <ActionGroup>
                <Action closeModal>
                  <Button color="danger">Delete project</Button>
                  <Button variant="soft" color="secondary">
                    Abort
                  </Button>
                </Action>
              </ActionGroup>
            </Modal>
          </ModalTrigger>
          <FileField>
            <Button variant="soft" color="secondary">
              Import CSV
            </Button>
          </FileField>
          <ContextMenuTrigger>
            <Button variant="soft" color="secondary">
              <IconContextMenu />
            </Button>
            <ContextMenu>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
        </Header>
        <Alert>
          <Heading>Alert in section</Heading>
        </Alert>
        <Text>{dummyText.long}</Text>
        <Heading level={3}>Sub-Heading</Heading>
        <Text>{dummyText.medium}</Text>
      </Section>
    </>
  ),
};
