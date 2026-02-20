import type { Meta, StoryObj } from "@storybook/react";
import Button from "@/components/Button";
import Text from "@/components/Text";
import TextField from "@/components/TextField";
import Label from "@/components/Label";
import Content from "@/components/Content";
import Heading from "@/components/Heading";
import Modal, { ModalTrigger } from "@/components/Modal";
import { useOverlayController } from "@/lib/controller/overlay/useOverlayController";
import { Action } from "@/components/Action";
import { ActionGroup } from "@/components/ActionGroup";
import { asyncLongFunction } from "@/components/Button/stories/lib";
import { Field, Form, SubmitButton } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Section } from "@/components/Section";
import { ColumnLayout } from "@/components/ColumnLayout";
import { AccentBox } from "@/components/AccentBox";
import { dummyText } from "@/lib/dev/dummyText";
import { RadioButton, RadioGroup } from "@/components/RadioGroup";
import { DatePicker } from "@/components/DatePicker";
import { FieldDescription } from "@/components/FieldDescription";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";
import { useModalController } from "@/lib/controller";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  parameters: {
    controls: { exclude: ["controller"] },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "m", "l"],
    },
    offCanvasOrientation: {
      control: "inline-radio",
      options: ["left", "right"],
    },
  },
  args: {
    size: "s",
    offCanvas: false,
    offCanvasOrientation: "right",
  },
  render: (props) => {
    return (
      <Modal {...props} isDefaultOpen>
        <Heading>New Customer</Heading>
        <Content>
          <Section>
            <Text>
              Create a new customer to manage your projects, members and
              payments.
            </Text>
            <TextField>
              <Label>Customer name</Label>
            </TextField>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Action onAction={asyncLongFunction}>
              <Button color="accent">Create customer</Button>
            </Action>
            <Button color="secondary" variant="soft">
              Abort
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const WithController: Story = {
  render: (props) => {
    const controller = useOverlayController("Modal", {
      onOpen: () => action("onOpen")(),
      onClose: () => action("onClose")(),
    });

    return (
      <>
        <Button onPress={controller.open}>Open controller</Button>
        <Modal {...props} controller={controller}>
          <Heading>Heading</Heading>
          <Content>
            <Text>{dummyText.long}</Text>
          </Content>
          <ActionGroup>
            <Action closeModal>
              <Button color="secondary" variant="soft">
                Abort
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </>
    );
  },
};

export const WithTrigger: Story = {
  render: (props) => (
    <ModalTrigger>
      <Button>Trigger</Button>
      <Modal {...props}>
        <Heading>Heading</Heading>
        <Content>
          <Text>{dummyText.long}</Text>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button color="secondary" variant="soft">
              Abort
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  ),
};

export const WithForm: Story = {
  render: (props) => {
    const form = useForm<{ name: string }>({
      defaultValues: { name: "" },
    });
    const controller = useModalController();

    return (
      <>
        <Button color="accent" onPress={controller.open}>
          Add customer
        </Button>

        <Modal
          {...props}
          controller={controller}
          onClose={() => {
            form.reset();
          }}
        >
          <Form form={form} onSubmit={() => () => controller.close()}>
            <Heading>Add Customer</Heading>
            <Content>
              <Field name="name" rules={{ required: "Please enter a name" }}>
                <TextField>
                  <Label>Customer name</Label>
                </TextField>
              </Field>
            </Content>
            <ActionGroup>
              <SubmitButton color="accent">Submit</SubmitButton>
              <Action closeModal>
                <Button variant="soft" color="secondary">
                  Abort
                </Button>
              </Action>
            </ActionGroup>
          </Form>
        </Modal>
      </>
    );
  },
};

export const WithColumnLayout: Story = {
  args: { size: "l", offCanvas: true },
  render: (props) => {
    return (
      <ModalTrigger>
        <Button color="accent">Book tariff</Button>

        <Modal {...props}>
          <Heading>Book tariff</Heading>

          <ColumnLayout>
            <Section>
              <Heading>Configuration</Heading>
              <Text>{dummyText.long}</Text>
              <Text>{dummyText.long}</Text>
              <Text>{dummyText.long}</Text>
            </Section>
            <AccentBox>
              <Section>
                <Heading level={4}>Overview</Heading>
                <Text>{dummyText.medium}</Text>
              </Section>
            </AccentBox>
          </ColumnLayout>

          <ActionGroup>
            <Button color="accent">Submit</Button>
            <Action closeModal>
              <Button variant="soft" color="secondary">
                Abort
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>
    );
  },
};

const loadingPromise = new Promise(() => {
  // no resolve
});

const Loader = () => {
  throw loadingPromise;
};

export const WithSuspense: Story = {
  render: (props) => {
    const [isLoading, setIsLoading] = useState(true);
    useTimeout(() => setIsLoading(false), 3000);
    return (
      <Modal {...props} isOpen>
        {isLoading ? <Loader /> : <Content>Loaded content!</Content>}
      </Modal>
    );
  },
};

export const LongContent: Story = {
  render: (props) => (
    <Modal {...props} isOpen>
      <Heading>{dummyText.short}</Heading>
      <Content>
        <Section>
          <Heading>Description</Heading>
          <Text>
            An SFTP user allows you to connect to your project, for example to
            upload files.
          </Text>
          <ColumnLayout m={[1, 1]}>
            <TextField isRequired>
              <Label>Name</Label>
            </TextField>
            <DatePicker>
              <Label>Expiration Date</Label>
              <FieldDescription>
                After this date, the SFTP user will be deleted.
              </FieldDescription>
            </DatePicker>
          </ColumnLayout>

          <Heading>Permissions</Heading>
          <Text>Select the permissions the SFTP user should have.</Text>
          <RadioGroup s={[1, 1]} defaultValue="read&write">
            <RadioButton value="write">
              <Text>Read Access</Text>
              <Content>The SFTP user can view and download files.</Content>
            </RadioButton>
            <RadioButton value="read&write">
              <Text>Read and Write Access</Text>
              <Content>
                The SFTP user can view, edit, upload, and download files.
              </Content>
            </RadioButton>
          </RadioGroup>

          <Heading>Directory Selection</Heading>
          <Text>
            Specify the directory the SFTP user should have access to.
          </Text>
          <TextField isRequired>
            <Label>Path</Label>
          </TextField>

          <Heading>{dummyText.short}</Heading>
          <Text>{dummyText.long}</Text>
          <Heading>{dummyText.short}</Heading>
          <Text>{dummyText.long}</Text>
          <Heading>{dummyText.short}</Heading>
          <Text>{dummyText.long}</Text>
          <Heading>{dummyText.short}</Heading>
          <Text>{dummyText.long}</Text>
        </Section>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button color="accent">Create customer</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  ),
};
