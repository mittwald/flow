import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { LabeledValue } from "@/components/LabeledValue";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";

/*
 * Label and value are one unit: the group takes its name from the label, so the
 * value is announced with what it is a value of.
 */
test("the group is named by its label", async () => {
  await render(
    <LabeledValue>
      <Label>Server</Label>
      <Text>rebelbase.org</Text>
    </LabeledValue>,
  );

  await expect
    .element(page.getByRole("group", { name: "Server" }))
    .toBeInTheDocument();
});

test("the label is not a form label but a plain element", async () => {
  await render(
    <LabeledValue>
      <Label>Server</Label>
      <Text>rebelbase.org</Text>
    </LabeledValue>,
  );

  expect(document.querySelector("label")).toBeNull();
  await expect.element(page.getByText("Server")).toBeVisible();
});
