import Button from "@/components/Button";
import Content from "@/components/Content";
import ModalTrigger from "@/components/Modal/components/ModalTrigger";
import Modal from "@/components/Modal/Modal";
import Text from "@/components/Text";
import { sleep } from "@/lib/promises/sleep";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

/**
 * A document-level node with the structural fingerprint of extension UI: a
 * custom element wrapping something focusable. React Aria makes everything
 * outside an open modal `inert`, which would leave such a node visible but
 * unusable.
 */
const appendExtensionNode = async () => {
  const node = document.createElement("fake-extension-ui");
  const input = document.createElement("input");
  node.append(input);
  document.body.append(node);

  // The hook picks the node up through a MutationObserver, so it is not handled
  // synchronously — and while the node is still `inert`, focus() is a no-op.
  await sleep(50);

  return { input, cleanup: () => node.remove() };
};

const ModalWithContent = () => (
  <ModalTrigger>
    <Button>Open Modal</Button>
    <Modal>
      <Content>
        <Text>Hello World</Text>
      </Content>
    </Modal>
  </ModalTrigger>
);

test("extension UI injected next to an open modal can take focus", async () => {
  const dom = await render(<ModalWithContent />);
  await userEvent.click(dom.getByRole("button", { name: "Open Modal" }));

  const extension = await appendExtensionNode();

  try {
    extension.input.focus();
    expect(document.activeElement).toBe(extension.input);
  } finally {
    extension.cleanup();
  }
});
