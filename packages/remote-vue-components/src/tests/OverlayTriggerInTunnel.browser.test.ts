import {
  Button,
  Content,
  Header,
  Heading,
  Modal,
  ModalTrigger,
  Section,
} from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h } from "vue";

/*
 * The Vue counterpart of the React package's test of the same name.
 *
 * A host that tunnels `Button` — a section header sends every button into its
 * actions slot — must not lift an overlay trigger's button out of the trigger:
 * react-aria hands the press handling, the trigger ref and
 * `aria-haspopup`/`aria-expanded`/`aria-controls` down through a
 * `PressResponder` that only reaches its own subtree.
 *
 * The Vue side reaches this through a different door. There is no
 * `ModalTrigger` on the host — this package's `ModalTrigger` emits a
 * `DialogTrigger` — so what is asserted here is the invariant on
 * `DialogTrigger` itself, which is also the one the React `Remote` environment
 * depends on.
 */
afterEach(() => cleanupRemote());

test("an overlay trigger's button keeps its aria wiring inside a tunneling props context", async () => {
  renderRemote(
    defineComponent(
      () => () =>
        h(Section, null, () =>
          h(Header, null, () => [
            h(Heading, null, () => "Heading"),
            h(ModalTrigger, null, () => [
              h(Button, { "data-testid": "trigger" }, () => "Trigger"),
              h(Modal, null, () => [
                h(Heading, null, () => "Modal"),
                h(Content, null, () => "Content"),
              ]),
            ]),
          ]),
        ),
    ),
  );

  const trigger = page.getByTestId("trigger");

  await expect.element(trigger).toHaveAttribute("aria-expanded", "false");

  // the button still belongs into the header's actions slot
  expect(
    trigger.element().closest("[class*='section-header--actions']"),
  ).not.toBeNull();

  await trigger.click();

  await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
});
