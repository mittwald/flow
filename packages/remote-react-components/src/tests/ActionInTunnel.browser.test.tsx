import { testEnvironments } from "@/tests/lib/environments";
import { expect, test, vi } from "vitest";
import { page } from "vitest/browser";

/*
 * `Action` is not `@flr-generate`: in an extension it stays inside the iframe,
 * and the host only receives the `Button` it wraps. `SectionHeader` and `Label`
 * have to tunnel that button through their `Button` entry, so `Local` and
 * `Remote` take the same path.
 */
test.each(testEnvironments)(
  "an action's button lands in the section header's actions slot (%s)",
  async ({
    render,
    components: { Section, Header, Heading, Action, Button, Text },
  }) => {
    const onAction = vi.fn();

    await render(
      <Section>
        <Header>
          <Heading>Death Star</Heading>
          <Action onAction={onAction}>
            <Button data-testid="action-button">Fire</Button>
          </Action>
        </Header>
        <Text>Briefing</Text>
      </Section>,
    );

    const button = page.getByTestId("action-button");
    await expect.element(button).toBeVisible();
    expect(
      button.element().closest("[class*='section-header--actions']"),
    ).not.toBeNull();

    await button.click();
    await vi.waitFor(() => expect(onAction).toHaveBeenCalledOnce());
  },
);

test.each(testEnvironments)(
  "an action's confirmation modal opens from the section header (%s)",
  async ({
    render,
    components: {
      Section,
      Header,
      Heading,
      Action,
      Button,
      Modal,
      Content,
      ActionGroup,
      Text,
    },
  }) => {
    const onAction = vi.fn();

    await render(
      <Section>
        <Header>
          <Heading>Death Star</Heading>
          <Action onAction={onAction}>
            <Modal slot="actionConfirm">
              <Heading>Fire the laser?</Heading>
              <Content>
                <Text>Alderaan will be gone.</Text>
              </Content>
              <ActionGroup>
                <Button color="danger">Fire</Button>
                <Button variant="soft" color="secondary">
                  Abort
                </Button>
              </ActionGroup>
            </Modal>
            <Button data-testid="action-button">Fire</Button>
          </Action>
        </Header>
      </Section>,
    );

    const button = page.getByTestId("action-button");
    await expect.element(button).toBeVisible();
    expect(
      button.element().closest("[class*='section-header--actions']"),
    ).not.toBeNull();

    await button.click();
    const dialog = page.getByRole("dialog");
    await expect.element(dialog).toBeVisible();
    expect(onAction).not.toHaveBeenCalled();

    await dialog.getByRole("button", { name: "Fire", exact: true }).click();
    await vi.waitFor(() => expect(onAction).toHaveBeenCalledOnce());
  },
);

test.each(testEnvironments)(
  "an action's button lands in the label's right slot (%s)",
  async ({ render, components: { TextField, Label, Action, Button } }) => {
    const onAction = vi.fn();

    await render(
      <TextField>
        <Label>
          Name
          <Action onAction={onAction}>
            <Button data-testid="action-button">Generate</Button>
          </Action>
        </Label>
      </TextField>,
    );

    const button = page.getByTestId("action-button");
    await expect.element(button).toBeVisible();
    expect(button.element().closest("[class*='label--right']")).not.toBeNull();

    await button.click();
    await vi.waitFor(() => expect(onAction).toHaveBeenCalledOnce());
  },
);
