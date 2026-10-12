import {
  Button,
  Content,
  Form,
  Label,
  Modal,
  ModalTrigger,
  TextField,
} from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

afterEach(() => cleanupRemote());

/*
 * An overlay renders through a portal, and React propagates events through a
 * portal along the React tree — so the submit of a form inside a modal used to
 * reach the form the modal is nested in, and both submitted (#2975).
 *
 * The guard is on the host: the `<form>` the renderer materialises stops the
 * propagation, because a remote submit arrives without a `nativeEvent` and the
 * remote side has nothing to stop. That host is the same one a Vue extension
 * talks to, so the guarantee is this binding's too — and this is the port of
 * the React package's `NestedFormSubmit`, which is what keeps it honest.
 */

/** The renderer sends its submit over the connection — give it a roundtrip. */
const waitForALateSubmit = () =>
  new Promise((resolve) => setTimeout(resolve, 300));

test("a Form submitted inside a Modal does not submit the Form around it", async () => {
  const onOuterSubmit = vi.fn();
  const onInnerSubmit = vi.fn();

  renderRemote(
    defineComponent(
      () => () =>
        h(Form, { action: onOuterSubmit }, () => [
          h(TextField, null, () => h(Label, null, () => "User")),
          h(ModalTrigger, null, () => [
            h(Button, { "data-testid": "open" }, () => "Create user"),
            h(Modal, null, () =>
              h(Content, null, () =>
                h(Form, { action: onInnerSubmit }, () => [
                  h(TextField, null, () => h(Label, null, () => "Username")),
                  h(
                    Button,
                    { type: "submit", "data-testid": "save" },
                    () => "Save",
                  ),
                ]),
              ),
            ),
          ]),
        ]),
    ),
  );

  await page.getByTestId("open").click();
  await page.getByTestId("save").click();

  await expect.poll(() => onInnerSubmit).toHaveBeenCalledTimes(1);
  await waitForALateSubmit();
  expect(onOuterSubmit).not.toHaveBeenCalled();
});
