import * as RemoteComponents from "@/index";
import * as RemoteReactHookForm from "@/integrations/react-hook-form";
import { renderLocal, renderRemote } from "@/tests/lib/environments";
import * as LocalComponents from "@mittwald/flow-react-components";
import * as LocalReactHookForm from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

/*
 * A dirty Form decides itself whether closing its Modal has to be confirmed,
 * and in a remote app the Form runs inside the extension. So both ways to
 * switch the confirmation off – the Form's prop and the
 * ComponentDefaultsProvider – have to work from the remote side (#3058).
 */

const environments = [
  {
    toString: () => "Local",
    render: renderLocal,
    components: { ...LocalComponents, ...LocalReactHookForm },
  },
  {
    toString: () => "Remote",
    render: renderRemote,
    components: { ...RemoteComponents, ...RemoteReactHookForm },
  },
] as const;

type Components = (typeof environments)[number]["components"];

interface EditUserModalProps {
  components: Components;
  confirmModalCloseOnUnsavedChanges?: boolean;
}

const EditUserModal = (props: EditUserModalProps) => {
  const { confirmModalCloseOnUnsavedChanges } = props;
  const {
    Action,
    Button,
    Content,
    Field,
    Form,
    Heading,
    Label,
    Modal,
    ModalTrigger,
    TextField,
  } = props.components;

  const form = useForm({ defaultValues: { username: "" } });

  return (
    <ModalTrigger>
      <Button data-testid="open">Edit user</Button>
      <Modal>
        <Heading>Edit user</Heading>
        <Content>
          <Form
            form={form}
            onSubmit={() => undefined}
            confirmModalCloseOnUnsavedChanges={
              confirmModalCloseOnUnsavedChanges
            }
          >
            <Field name="username">
              <TextField>
                <Label>Username</Label>
              </TextField>
            </Field>
            <Action closeModal>
              <Button data-testid="close">Close</Button>
            </Action>
          </Form>
        </Content>
      </Modal>
    </ModalTrigger>
  );
};

const editUserModal = () => page.getByRole("dialog", { name: "Edit user" });

const closeWithUnsavedChanges = async () => {
  await page.getByTestId("open").click();
  // Guards the assertions on a closed Modal: a locator that never matched
  // would pass them without anything having closed.
  await expect.element(editUserModal()).toBeVisible();
  await page.getByLabelText("Username").fill("someone");
  await page.getByTestId("close").click();
};

test.each(environments)(
  "closing a Modal with a dirty Form asks for confirmation (%s)",
  async ({ render, components }) => {
    await render(<EditUserModal components={components} />);
    await closeWithUnsavedChanges();

    await expect
      .element(page.getByRole("dialog", { name: "Unsaved changes" }))
      .toBeVisible();
    await expect.element(editUserModal()).toBeInTheDocument();
  },
);

test.each(environments)(
  "the Form's confirmModalCloseOnUnsavedChanges prop switches the confirmation off (%s)",
  async ({ render, components }) => {
    await render(
      <EditUserModal
        components={components}
        confirmModalCloseOnUnsavedChanges={false}
      />,
    );
    await closeWithUnsavedChanges();

    await expect.element(editUserModal()).not.toBeInTheDocument();
  },
);

test.each(environments)(
  "a ComponentDefaultsProvider switches the confirmation off (%s)",
  async ({ render, components }) => {
    const { ComponentDefaultsProvider } = components;

    await render(
      <ComponentDefaultsProvider
        defaults={{ Form: { confirmModalCloseOnUnsavedChanges: false } }}
      >
        <EditUserModal components={components} />
      </ComponentDefaultsProvider>,
    );
    await closeWithUnsavedChanges();

    await expect.element(editUserModal()).not.toBeInTheDocument();
  },
);
