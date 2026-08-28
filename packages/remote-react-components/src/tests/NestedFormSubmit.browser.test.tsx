import * as RemoteComponents from "@/index";
import * as RemoteReactHookForm from "@/integrations/react-hook-form";
import { renderLocal, renderRemote } from "@/tests/lib/environments";
import { sleep } from "@/tests/lib/sleep";
import * as LocalComponents from "@mittwald/flow-react-components";
import * as LocalReactHookForm from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";
import { expect, test, vi } from "vitest";
import { page } from "vitest/browser";

/*
 * A Modal renders through a portal, and React propagates synthetic events
 * through portals along the React tree. So the submit of a Form inside a Modal
 * reaches the Form the Modal is nested in, and the surrounding form submits as
 * well (#2975).
 *
 * The Form of `@mittwald/flow-react-components` stops that propagation itself,
 * which is why this only ever showed remotely: the remote Form receives a
 * remote event without a `nativeEvent`, so its guard never runs. The host-side
 * <form> of the renderer is what has to stop it, hence the assertions here are
 * on the callbacks reaching the remote side, not on the rendered output.
 */

/** The renderer sends its submit over the connection — give it a roundtrip. */
const waitForALateSubmit = () => sleep(300);

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

interface NestedFormProps {
  components: Components;
  onOuterSubmit: () => void;
  onInnerSubmit: () => void;
}

const NestedForm = (props: NestedFormProps) => {
  const { onOuterSubmit, onInnerSubmit } = props;
  const {
    ActionGroup,
    Button,
    Content,
    Field,
    Form,
    Label,
    Modal,
    ModalTrigger,
    TextField,
  } = props.components;

  const outerForm = useForm({ defaultValues: { user: "" } });
  const innerForm = useForm({ defaultValues: { username: "" } });

  return (
    <Form form={outerForm} onSubmit={onOuterSubmit}>
      <Field name="user">
        <TextField>
          <Label>User</Label>
        </TextField>
      </Field>

      <ModalTrigger>
        <Button data-testid="open">Create user</Button>
        <Modal>
          <Content>
            <Form form={innerForm} onSubmit={onInnerSubmit}>
              <Field name="username" rules={{ required: true }}>
                <TextField>
                  <Label>Username</Label>
                </TextField>
              </Field>
              <ActionGroup>
                <Button type="submit" data-testid="save">
                  Save
                </Button>
              </ActionGroup>
            </Form>
          </Content>
        </Modal>
      </ModalTrigger>
    </Form>
  );
};

test.each(environments)(
  "a Form submitted inside a Modal does not submit the Form around it (%s)",
  async ({ render, components }) => {
    const onOuterSubmit = vi.fn();
    const onInnerSubmit = vi.fn();

    await render(
      <NestedForm
        components={components}
        onOuterSubmit={onOuterSubmit}
        onInnerSubmit={onInnerSubmit}
      />,
    );

    await page.getByTestId("open").click();
    await page.getByLabelText("Username").fill("someone");
    await page.getByTestId("save").click();

    await expect.poll(() => onInnerSubmit).toHaveBeenCalledTimes(1);
    await waitForALateSubmit();
    expect(onOuterSubmit).not.toHaveBeenCalled();
  },
);

/*
 * The plain Form is remote-only. It reaches the same host-side <form> through
 * the second renderer component, and its `action` runs without an onSubmit
 * handler at all — the case that decides whether the guard can be attached
 * next to `preventDefault()`.
 */
test("a plain Form action inside a Modal does not submit the Form around it", async () => {
  const {
    Button,
    Content,
    Form: PlainForm,
    Label,
    Modal,
    ModalTrigger,
    TextField,
  } = RemoteComponents;
  const { Field, Form } = RemoteReactHookForm;

  const onOuterSubmit = vi.fn();
  const onInnerAction = vi.fn();

  const Scenario = () => {
    const outerForm = useForm({ defaultValues: { user: "" } });

    return (
      <Form form={outerForm} onSubmit={onOuterSubmit}>
        <Field name="user">
          <TextField>
            <Label>User</Label>
          </TextField>
        </Field>

        <ModalTrigger>
          <Button data-testid="open">Create user</Button>
          <Modal>
            <Content>
              <PlainForm action={onInnerAction}>
                <Button type="submit" data-testid="save">
                  Save
                </Button>
              </PlainForm>
            </Content>
          </Modal>
        </ModalTrigger>
      </Form>
    );
  };

  await renderRemote(<Scenario />);

  await page.getByTestId("open").click();
  await page.getByTestId("save").click();

  await expect.poll(() => onInnerAction).toHaveBeenCalledTimes(1);
  await waitForALateSubmit();
  expect(onOuterSubmit).not.toHaveBeenCalled();
});
