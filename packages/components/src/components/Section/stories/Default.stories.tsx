import type { Meta, StoryObj } from "@storybook/react";
import Section from "../Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Link } from "@/components/Link";
import { Switch } from "@/components/Switch";
import { AlertBadge } from "@/components/AlertBadge";
import Header from "@/components/Header";
import {
  IconContextMenu,
  IconMember,
} from "@/components/Icon/components/icons";
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
import { Field, Form, SubmitButton } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import Content from "@/components/Content";
import ActionGroup from "@/components/ActionGroup";

const meta: Meta<typeof Section> = {
  title: "Structure/Section",
  component: Section,
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
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {};

export const MultipleSections: Story = {
  render: (props) => (
    <>
      <Section {...props}>
        <Heading>
          <IconMember />
          Personal Information
        </Heading>
        <TextField isRequired defaultValue="John">
          <Label>First name</Label>
        </TextField>
        <TextField isRequired defaultValue="Doe">
          <Label>Last name</Label>
        </TextField>
      </Section>
      <Section {...props}>
        <Heading>Newsletter</Heading>
        <Text>
          Upcoming releases, new features and tips about your hosting - we bring
          you the most important information in your inbox. Subscribe to our
          newsletter and stay up to date.
        </Text>
        <Link href="#">Subscribe</Link>
      </Section>
    </>
  ),
};

export const WithHeaderContent: Story = {
  render: (props) => (
    <>
      <Section {...props}>
        <Header>
          <Heading>
            Newsletter <AlertBadge>Subscribed</AlertBadge>
          </Heading>

          <Switch defaultSelected>Subscription</Switch>
          <Button variant="soft" color="secondary">
            Start database migration
          </Button>
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
            My Project with a looooooooooong name
            <AlertBadge status="danger">Deactivated</AlertBadge>
          </Heading>
          <Button variant="soft" color="secondary">
            Start database migration
          </Button>
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
        </Header>
        <Text>{dummyText.medium}</Text>
      </Section>
      <Section {...props}>
        <Header>
          <Heading>My Project</Heading>
          <ContextMenuTrigger>
            <Button variant="soft" color="secondary">
              <IconContextMenu />
            </Button>
            <ContextMenu>
              <MenuItem>Item 1</MenuItem>
              <MenuItem>Item 2</MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
          <Button color="danger">Deactivate</Button>
        </Header>
        <Text>{dummyText.medium}</Text>
      </Section>
    </>
  ),
};

export const WithSubHeadings: Story = {
  render: (props) => (
    <>
      <Section {...props}>
        <Heading>Heading</Heading>
        <Text>{dummyText.long}</Text>
        <Heading level={3}>Sub-Heading</Heading>
        <Text>{dummyText.long}</Text>
        <Heading level={4}>Sub-Sub-Heading</Heading>
        <Text>{dummyText.long}</Text>
      </Section>
      <Section {...props}>
        <Header>
          <Heading>Heading</Heading>
          <Button>Button</Button>
        </Header>
        <Text>{dummyText.long}</Text>
        <Header>
          <Heading level={3}>Sub-Heading</Heading>
          <Button>Button</Button>
        </Header>
        <Text>{dummyText.long}</Text>
      </Section>
    </>
  ),
};

export const HideSeperator: Story = {
  render: (props) => (
    <>
      <Section {...props} hideSeparator>
        <Heading>
          <IconMember />
          Personal Information
        </Heading>
        <TextField isRequired defaultValue="John">
          <Label>First name</Label>
        </TextField>
        <TextField isRequired defaultValue="Doe">
          <Label>Last name</Label>
        </TextField>
      </Section>
      <Section {...props}>
        <Heading>Newsletter</Heading>
        <Text>
          Upcoming releases, new features and tips about your hosting - we bring
          you the most important information in your inbox. Subscribe to our
          newsletter and stay up to date.
        </Text>
        <Link href="#">Subscribe</Link>
      </Section>
    </>
  ),
};

export const WithFileField: Story = {
  render: (props) => (
    <>
      <Section {...props} hideSeparator>
        <Header>
          <Heading>Domains</Heading>
          <FileField>
            <Button>Import CSV</Button>
          </FileField>
          <Button>Add</Button>
        </Header>
        <Text>Add at least one domain.</Text>
      </Section>
    </>
  ),
};

export const WithForm: Story = {
  render: (props) => {
    const form = useForm();

    return (
      <Section {...props}>
        <Form form={form} onSubmit={() => action("submit")}>
          <Heading>
            <IconMember />
            Personal Information
          </Heading>
          <Field name="firstName">
            <TextField isRequired defaultValue="John">
              <Label>First name</Label>
            </TextField>
          </Field>
          <Field name="lastName">
            <TextField isRequired defaultValue="Doe">
              <Label>Last name</Label>
            </TextField>
          </Field>
          <Heading level={3}>Newsletter</Heading>
          <Text>
            Upcoming releases, new features and tips about your hosting - we
            bring you the most important information in your inbox. Subscribe to
            our newsletter and stay up to date.
          </Text>
          <Link href="#">Subscribe</Link>
          <ActionGroup>
            <SubmitButton color="accent">Submit</SubmitButton>
          </ActionGroup>
        </Form>
      </Section>
    );
  },
};
