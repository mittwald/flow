import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import Autocomplete from "@/components/Autocomplete";
import Option from "@/components/Option";
import SearchField from "@/components/SearchField";
import TextField from "@/components/TextField";
import { Label } from "@/components/Label";

const testUi = (
  <Autocomplete>
    <SearchField>
      <Label>Comlink address</Label>
    </SearchField>
    <Option value="luke@rebellion.org">luke@rebellion.org</Option>
    <Option value="luke@jedi.org">luke@jedi.org</Option>
  </Autocomplete>
);

/**
 * `toBeVisible()` only inspects the element itself, so it still passes when an
 * ancestor collapses the element to zero height. Hit-testing the element's
 * center is what tells us whether a user can actually see and click the
 * option.
 */
const isHitTestable = (element: Element) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  const elementAtCenter = document.elementFromPoint(
    left + width / 2,
    top + height / 2,
  );
  return !!elementAtCenter && element.contains(elementAtCenter);
};

const typeIntoField = async (value: string) => {
  const field = page.getByRole("searchbox");
  await userEvent.click(field);
  await userEvent.type(field, value);
  return field;
};

test("options are shown while typing", async () => {
  await render(testUi);

  await typeIntoField("luke");

  const option = page.getByRole("option", { name: "luke@rebellion.org" });
  await expect.element(option).toBeVisible();
  expect(isHitTestable(option.element())).toBe(true);
});

test("options are aligned with the field", async () => {
  // A TextField's input sits flush with the field container, which is exactly
  // where react-aria's container padding would push the popover away from: it
  // keeps the popover that distance from the edges of its boundary, and the
  // boundary here is the field container the popover is positioned inside.
  await render(
    <Autocomplete>
      <TextField>
        <Label>Comlink address</Label>
      </TextField>
      <Option value="luke@rebellion.org">luke@rebellion.org</Option>
    </Autocomplete>,
  );

  const field = page.getByRole("textbox");
  await userEvent.click(field);
  await userEvent.type(field, "luke");
  await expect.element(page.getByRole("listbox")).toBeVisible();

  const options = page.getByRole("listbox").element().getBoundingClientRect();
  const { left } = field.element().getBoundingClientRect();
  expect(Math.abs(options.left - left)).toBeLessThanOrEqual(2);
});

test("options are shown below a field far down inside a positioned ancestor", async () => {
  // The options popover is portaled into the Autocomplete itself, so without a
  // positioning context of its own it falls back to the next positioned
  // ancestor. react-aria then measures the space below the field from that
  // ancestor's origin instead of from the viewport, which collapses the popover
  // to `max-height: 0` once the field sits more than one viewport below it.
  await render(
    <div style={{ position: "relative" }}>
      <div style={{ height: "200vh" }} />
      {testUi}
      <div style={{ height: "200vh" }} />
    </div>,
  );

  // Scroll the field to the top of the viewport so the popover opens downwards
  // – opening upwards uses a different, unaffected calculation.
  page.getByRole("searchbox").element().scrollIntoView({ block: "start" });

  await typeIntoField("luke");

  const option = page.getByRole("option", { name: "luke@rebellion.org" });
  await expect.element(option).toBeVisible();
  expect(isHitTestable(option.element())).toBe(true);
});

test("selecting an option fills the field", async () => {
  await render(testUi);

  await typeIntoField("luke");
  await userEvent.click(page.getByRole("option", { name: "luke@jedi.org" }));

  await expect
    .element(page.getByRole("searchbox"))
    .toHaveValue("luke@jedi.org");
});
