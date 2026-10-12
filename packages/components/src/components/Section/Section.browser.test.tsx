import { describe, expect, test, vitest } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Button } from "@/components/Button";
import { Content } from "@/components/Content";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { Header } from "@/components/Header";
import { Heading } from "@/components/Heading";
import { Modal, ModalTrigger } from "@/components/Modal";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import sectionHeaderStyles from "@/components/Section/components/SectionHeader/SectionHeader.module.scss";

const testElement = (
  <Section>
    <Header>
      <Heading>Death Star</Heading>
      <ModalTrigger>
        <Button>Battle station controls</Button>
        <Modal>
          <Heading>Battle station controls</Heading>
          <Content>
            <Text>Command the systems.</Text>
          </Content>
        </Modal>
      </ModalTrigger>
    </Header>
    <Text>Briefing</Text>
  </Section>
);

const triggerButton = () =>
  page.getByRole("button", { name: "Battle station controls" });

/*
 * A section header tunnels its actions into a dedicated slot. Tunnelling the
 * trigger button alone would lift it out of the trigger's own subtree, where
 * react-aria's PressResponder hands down the press handling and the ARIA
 * attributes — so the header has to tunnel the whole trigger. `aria-expanded`
 * only reaches the button through that PressResponder.
 */
test("A modal trigger in a section header keeps its trigger wiring", async () => {
  render(testElement);

  await expect
    .element(triggerButton())
    .toHaveAttribute("aria-expanded", "false");

  await triggerButton().click();

  await expect.element(page.getByText("Command the systems.")).toBeVisible();
  await expect
    .element(triggerButton())
    .toHaveAttribute("aria-expanded", "true");
});

test("A modal trigger in a section header renders in the actions slot", async () => {
  render(testElement);

  await expect.element(triggerButton()).toBeVisible();
  const button = await triggerButton().element();

  expect(button.closest(`.${sectionHeaderStyles.actions}`)).not.toBeNull();
});

test("A section header does not render a press responder without its child", async () => {
  const warn = vitest.spyOn(console, "warn");

  try {
    render(testElement);
    await expect.element(triggerButton()).toBeVisible();

    expect(warn.mock.calls.flat().join("\n")).not.toContain("PressResponder");
  } finally {
    warn.mockRestore();
  }
});

describe("toggling the children", () => {
  const ToggleSection = (props: { show: boolean }) => (
    <Section>{props.show && <Text>Briefing</Text>}</Section>
  );

  test("renders the children once they appear", async () => {
    const { rerender } = await render(<ToggleSection show={false} />);

    await rerender(<ToggleSection show />);

    await expect.element(page.getByText("Briefing")).toBeVisible();
  });

  test("renders nothing once the children disappear", async () => {
    const { rerender, container } = await render(<ToggleSection show />);
    await expect.element(page.getByText("Briefing")).toBeVisible();

    await rerender(<ToggleSection show={false} />);

    expect(container.querySelector("section")).toBeNull();
  });

  test("renders the children once they appear in a context menu", async () => {
    const Menu = (props: { show: boolean }) => (
      <ContextMenuTrigger>
        <Button>Open menu</Button>
        <ContextMenu>
          <Section>{props.show && <MenuItem>Fire the laser</MenuItem>}</Section>
          <MenuItem>Self destruct</MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    );

    const { rerender } = await render(<Menu show={false} />);
    await page.getByText("Open menu").click();
    await expect.element(page.getByText("Self destruct")).toBeVisible();

    await rerender(<Menu show />);

    await expect
      .element(page.getByRole("menuitem", { name: "Fire the laser" }))
      .toBeVisible();
  });
});
