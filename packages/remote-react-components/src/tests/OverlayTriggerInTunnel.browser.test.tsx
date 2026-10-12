import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

/*
 * A host that tunnels `Button` — `SectionHeader` sends every button into its
 * actions slot — must not lift an overlay trigger's button out of the trigger:
 * react-aria hands the press handling, the trigger ref and
 * `aria-haspopup`/`aria-expanded`/`aria-controls` down through a
 * `PressResponder` that only reaches its own subtree.
 *
 * This has to hold in both environments, and the two paths are not the same
 * component. `ModalTrigger` is not `@flr-generate`, so the host never sees a
 * `ModalTrigger`: the remote tree emits the trigger's view, and the host
 * materialises `DialogTrigger`. A props context keyed on `ModalTrigger` — and
 * an `OverlayTrigger` that pins the button — therefore only covers `Local`;
 * `Remote` needs the same invariant on `DialogTrigger` itself.
 *
 * The visual suite shares one reference per scenario across both environments,
 * so a divergence here also surfaces as a screenshot mismatch that
 * `--update` cannot resolve — whichever environment runs last wins the file.
 */
test.each(testEnvironments)(
  "an overlay trigger's button keeps its aria wiring inside a tunneling props context (%s)",
  async ({
    render,
    components: {
      Button,
      Modal,
      Heading,
      Content,
      ModalTrigger,
      Section,
      Header,
    },
  }) => {
    await render(
      <Section>
        <Header>
          <Heading>Heading</Heading>
          <ModalTrigger>
            <Button data-testid="trigger">Trigger</Button>
            <Modal>
              <Heading>Modal</Heading>
              <Content>Content</Content>
            </Modal>
          </ModalTrigger>
        </Header>
      </Section>,
    );

    const trigger = page.getByTestId("trigger");

    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");

    // the button still belongs into the header's actions slot
    expect(
      trigger.element().closest("[class*='section-header--actions']"),
    ).not.toBeNull();

    await trigger.click();

    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
  },
);
