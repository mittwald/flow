import { Button, Heading, Label, Section, TextField } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

afterEach(() => cleanupRemote());

describe("A Vue tree rendered through the host renderer", () => {
  test("renders a Flow component the host materializes", async () => {
    renderRemote(
      defineComponent(
        () => () => h(Section, null, () => h(Heading, null, () => "Hello Vue")),
      ),
    );

    await expect
      .element(page.getByRole("heading", { name: "Hello Vue" }))
      .toBeVisible();
  });

  test("passes props through as remote properties", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(Button, { color: "danger", isDisabled: true }, () => "Delete"),
      ),
    );

    const button = page.getByRole("button", { name: "Delete" });
    await expect.element(button).toBeDisabled();
  });

  /*
   * A render function that builds its props conditionally drops the key
   * itself, rather than passing `undefined`. Nothing then visits that
   * property again, so the element keeps the last value it was given — a
   * button that stays disabled after the thing that disabled it is over.
   */
  test("clears a property that the next render no longer passes", async () => {
    const isDisabled = ref(true);

    renderRemote(
      defineComponent(
        () => () =>
          h(Button, isDisabled.value ? { isDisabled: true } : {}, () => "Fire"),
      ),
    );

    const button = page.getByRole("button", { name: "Fire" });
    await expect.element(button).toBeDisabled();

    isDisabled.value = false;

    await expect.element(button).toBeEnabled();
  });

  test("accepts a prop in Vue's kebab-case spelling", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          /*
           * What a template writes as `:is-disabled="true"`. Vue camelizes
           * declared props only, and these components declare none — so the
           * factory has to do it, or the prop silently becomes a DOM attribute.
           */
          h(Button, { "is-disabled": true }, () => "Delete"),
      ),
    );

    await expect
      .element(page.getByRole("button", { name: "Delete" }))
      .toBeDisabled();
  });

  /*
   * A template's bare attribute (`<TextField is-required>`) arrives as `""`.
   * Vue casts that for declared `Boolean` props only; these declare none, so
   * the generator lists the boolean props and the factory casts them.
   */
  test("reads a bare boolean attribute as true", async () => {
    renderRemote(
      defineComponent(() => () => [
        /* What a template compiles `<TextField is-required>` to. */
        h(TextField, { "is-required": "" } as never, () =>
          h(Label, null, () => "Name"),
        ),
        h(Button, { "is-disabled": "is-disabled" } as never, () => "Delete"),
        h(Button, { "aria-disabled": "" } as never, () => "Archive"),
      ]),
    );

    await expect.element(page.getByRole("textbox")).toBeRequired();
    await expect
      .element(page.getByRole("button", { name: "Delete" }))
      .toBeDisabled();
    await expect
      .element(page.getByRole("button", { name: "Archive" }))
      .toHaveClass("flow--button--aria-disabled");
  });

  /*
   * `style` never reaches the host — it is off the remote surface by design,
   * and the host maps it to nothing. Vue normalizes every template `style`
   * into an object, and assigning that to the element wrote
   * `style="[object Object]"` into the remote tree.
   */
  test("keeps style off the element", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(Button, { style: { color: "red" } } as never, () => "Fire"),
      ),
    );

    await expect
      .element(page.getByRole("button", { name: "Fire" }))
      .toBeVisible();
    const element = document.querySelector("flr-button");
    expect(element).not.toBeNull();
    expect(element?.getAttribute("style")).toBeNull();
  });

  /* A string prop keeps its empty value. */
  test("leaves an empty string prop alone", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(TextField, { placeholder: "" }, () => h(Label, null, () => "Name")),
      ),
    );

    await expect
      .element(page.getByRole("textbox"))
      .toHaveAttribute("placeholder", "");
  });

  /*
   * Flow declares plenty of dashed props — `aria-label`, `data-testid`,
   * `aria-describedby`. Camelizing them the way a kebab-cased Vue prop needs
   * loses them: `data-testid` becomes `dataTestid`, which the element does not
   * know, and the value never leaves the remote side. `aria-*` hid the bug,
   * because the DOM reflects `ariaLabel` back onto the attribute.
   */
  test("passes a prop the element declares with dashes through as written", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(
            Button,
            { "data-testid": "fire", "aria-label": "Fire proton torpedo" },
            () => "Fire",
          ),
      ),
    );

    await expect
      .element(page.getByTestId("fire"))
      .toHaveAttribute("aria-label", "Fire proton torpedo");
  });

  test("delivers a host event to the Vue listener", async () => {
    const onPress = vi.fn();

    renderRemote(
      defineComponent(() => () => h(Button, { onPress }, () => "Press me")),
    );

    await page.getByRole("button", { name: "Press me" }).click();

    await vi.waitFor(() => expect(onPress).toHaveBeenCalledTimes(1));
  });

  test("updates the host when reactive state changes", async () => {
    const Counter = defineComponent(() => {
      const count = ref(0);
      return () =>
        h(
          Button,
          { onPress: () => count.value++ },
          () => `Count ${count.value}`,
        );
    });

    renderRemote(Counter);

    await page.getByRole("button", { name: "Count 0" }).click();

    await expect
      .element(page.getByRole("button", { name: "Count 1" }))
      .toBeVisible();
  });

  test("round-trips a controlled field", async () => {
    const Field = defineComponent(() => {
      const value = ref("");
      return () =>
        h(TextField, {
          "aria-label": "Name",
          value: value.value,
          onChange: (next: string) => (value.value = next),
        });
    });

    renderRemote(Field);

    const field = page.getByRole("textbox", { name: "Name" });
    await field.fill("Ada");

    await expect.element(field).toHaveValue("Ada");
  });
});
