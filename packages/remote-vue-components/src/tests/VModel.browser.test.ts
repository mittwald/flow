import { Checkbox, Label, Switch, TextField } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page, userEvent } from "vitest/browser";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

/*
 * What the template compiler makes of `v-model` on a component, written out:
 * `v-model="x"` is `modelValue` plus `onUpdate:modelValue`, `v-model:is-selected`
 * is `is-selected` plus `onUpdate:isSelected`, and modifiers arrive as
 * `modelModifiers` / `<arg>Modifiers`.
 */
afterEach(() => cleanupRemote());

const textbox = () => page.getByRole("textbox", { name: "Name" });

test("v-model on a field binds its value both ways", async () => {
  const name = ref("Ripley");

  renderRemote(
    defineComponent(
      () => () =>
        h(
          TextField,
          {
            modelValue: name.value,
            "onUpdate:modelValue": (value: string) => (name.value = value),
          },
          () => h(Label, null, () => "Name"),
        ),
    ),
  );

  await expect.element(textbox()).toHaveValue("Ripley");

  await userEvent.clear(textbox());
  await userEvent.type(textbox(), "Bishop");
  await expect.poll(() => name.value).toBe("Bishop");

  name.value = "Hicks";
  await expect.element(textbox()).toHaveValue("Hicks");
});

test("v-model applies .trim", async () => {
  const name = ref("");

  renderRemote(
    defineComponent(
      () => () =>
        h(
          TextField,
          {
            modelValue: name.value,
            modelModifiers: { trim: true },
            "onUpdate:modelValue": (value: string) => (name.value = value),
          },
          () => h(Label, null, () => "Name"),
        ),
    ),
  );

  await userEvent.type(textbox(), "  Vasquez ");
  await expect.poll(() => name.value).toBe("Vasquez");
});

test("a bare v-model on a checkbox binds isSelected", async () => {
  const accepted = ref(false);

  renderRemote(
    defineComponent(
      () => () =>
        h(
          Checkbox,
          {
            modelValue: accepted.value,
            "onUpdate:modelValue": (value: boolean) => (accepted.value = value),
          },
          () => "Accept",
        ),
    ),
  );

  const checkbox = page.getByRole("checkbox", { name: "Accept" });
  await expect.element(checkbox).not.toBeChecked();

  await checkbox.click({ force: true });
  await expect.poll(() => accepted.value).toBe(true);

  accepted.value = false;
  await expect.element(checkbox).not.toBeChecked();
});

test("a named v-model binds the prop it names", async () => {
  const isOn = ref(true);

  renderRemote(
    defineComponent(
      () => () =>
        h(
          Switch,
          {
            "is-selected": isOn.value,
            "onUpdate:isSelected": (value: boolean) => (isOn.value = value),
          },
          () => "Notifications",
        ),
    ),
  );

  const toggle = page.getByRole("switch", { name: "Notifications" });
  await expect.element(toggle).toBeChecked();

  await toggle.click({ force: true });
  await expect.poll(() => isOn.value).toBe(false);
});

test("a v-model with nothing to bind warns instead of landing as an attribute", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

  try {
    renderRemote(
      defineComponent(
        () => () =>
          h(
            TextField,
            { isInvalid: false, "onUpdate:nothing": () => undefined },
            () => h(Label, null, () => "Name"),
          ),
      ),
    );
    await expect.element(textbox()).toBeVisible();

    expect(warn.mock.calls.flat().join("\n")).toContain(
      "v-model:nothing on <TextField> binds nothing",
    );
  } finally {
    warn.mockRestore();
  }
});
