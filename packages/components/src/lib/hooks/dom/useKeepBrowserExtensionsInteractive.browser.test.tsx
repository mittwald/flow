import Button from "@/components/Button";
import Content from "@/components/Content";
import ModalTrigger from "@/components/Modal/components/ModalTrigger";
import Modal from "@/components/Modal/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/Table";
import TextField from "@/components/TextField";
import { Field, Form } from "@/integrations/react-hook-form";
import { sleep } from "@/lib/promises/sleep";
import { useForm } from "react-hook-form";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

/**
 * A document-level node with the structural fingerprint of extension UI: a
 * custom element wrapping something focusable.
 *
 * `stripsForeignAttributes` reproduces how password managers defend their own
 * UI against the surrounding page. Bitwarden's
 * `removeModifiedElementAttributes` keeps only `style` and `popover` and drops
 * everything else, which takes the hook's marking back off right after it set
 * it.
 */
const appendExtensionNode = async (options: {
  stripsForeignAttributes: boolean;
}) => {
  const node = document.createElement("fake-extension-ui");
  const input = document.createElement("input");
  node.append(input);

  const stripper = new MutationObserver(() => {
    for (const { name } of Array.from(node.attributes)) {
      if (name !== "style") {
        node.removeAttribute(name);
      }
    }
  });

  document.body.append(node);
  // The hook picks the node up through a MutationObserver, so it is not marked
  // synchronously — and while it is still `inert`, focus() would be a no-op.
  await sleep(50);

  if (options.stripsForeignAttributes) {
    stripper.observe(node, { attributes: true });
    node.setAttribute("data-trigger-stripper", "");
    await sleep(20);
  }

  return {
    input,
    cleanup: () => {
      stripper.disconnect();
      node.remove();
    },
  };
};

/**
 * The configuration the focus loop needs:
 *
 * - A `Table` on the page. Non-containing scopes like this one clear
 *   `activeScope` when focus lands outside every scope, and with no active
 *   scope every containing scope claims focus at once.
 * - A modal plus the "unsaved changes" confirmation it opens on a dirty form, so
 *   two scopes contain focus simultaneously.
 */
const PageWithDirtyFormModal = () => {
  const form = useForm();

  return (
    <>
      <Table aria-label="Page table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>One</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <ModalTrigger>
        <Button>Open Modal</Button>
        <Modal>
          <Content>
            <Form form={form} onSubmit={vitest.fn()}>
              <Field name="testField">
                <TextField />
              </Field>
            </Form>
          </Content>
        </Modal>
      </ModalTrigger>
    </>
  );
};

test.each([
  { stripsForeignAttributes: false },
  { stripsForeignAttributes: true },
])(
  "extension UI can take focus while two scopes contain it (extension strips attributes: $stripsForeignAttributes)",
  async ({ stripsForeignAttributes }) => {
    const dom = await render(<PageWithDirtyFormModal />);

    await userEvent.click(dom.getByRole("button", { name: "Open Modal" }));
    await userEvent.type(dom.getByRole("textbox"), "Some changes");
    await userEvent.keyboard("{Escape}");
    await expect
      .element(dom.getByRole("button", { name: "Keep editing", exact: true }))
      .toBeInTheDocument();

    const extension = await appendExtensionNode({ stripsForeignAttributes });

    try {
      let focusEvents = 0;
      const countFocusEvents = () => focusEvents++;
      document.addEventListener("focusin", countFocusEvents, true);

      extension.input.focus();

      // Asserted synchronously, before the extension's MutationObserver can
      // strip the marking again. A scope that rejects the node restores focus
      // from its own `focusin` listener, which re-enters that listener through
      // the `focus()` call — two scopes rejecting each other's node recurse
      // until the call stack overflows and the tab freezes.
      expect(document.activeElement).toBe(extension.input);
      document.removeEventListener("focusin", countFocusEvents, true);
      expect(focusEvents).toBeLessThan(5);
    } finally {
      extension.cleanup();
    }
  },
);
