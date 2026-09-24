import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import styles from "./ActionGroup.module.scss";

/*
 * The slot is not a DOM attribute – react-aria consumes it – so what the group
 * assigns is read off the class it puts on the button for that slot.
 */
const slotOf = (name: string) => {
  const button = Array.from(document.querySelectorAll("button")).find(
    (candidate) => candidate.textContent?.includes(name),
  );

  if (button?.classList.contains(styles.primary)) {
    return "primary";
  }

  if (button?.classList.contains(styles.abort)) {
    return "abort";
  }

  return undefined;
};

/*
 * The group sorts its buttons by intent, and the intent is read off the
 * colour: everything that carries out the action ends up as `primary`, the way
 * back as `abort`.
 */
test("the colour decides which slot a button lands in", async () => {
  await render(
    <ActionGroup>
      <Button color="secondary">Cancel</Button>
      <Button color="primary">Save</Button>
      <Button color="danger">Delete</Button>
    </ActionGroup>,
  );

  expect(slotOf("Save")).toBe("primary");
  expect(slotOf("Delete")).toBe("primary");
  expect(slotOf("Cancel")).toBe("abort");
});

test("a button without a colour counts as primary", async () => {
  await render(
    <ActionGroup>
      <Button>Save</Button>
    </ActionGroup>,
  );

  expect(slotOf("Save")).toBe("primary");
});

test("a slot set on the button wins over the guess", async () => {
  await render(
    <ActionGroup>
      <Button color="primary" slot="abort">
        Back
      </Button>
    </ActionGroup>,
  );

  expect(slotOf("Back")).toBe("abort");
});

// With `preserveOrder` the group stops sorting, so it assigns no slots either.
test("preserveOrder leaves the buttons unsorted", async () => {
  await render(
    <ActionGroup preserveOrder>
      <Button color="secondary">Cancel</Button>
      <Button color="primary">Save</Button>
    </ActionGroup>,
  );

  expect(slotOf("Cancel")).toBeUndefined();
  expect(slotOf("Save")).toBeUndefined();
});

test("the group is announced as a group", async () => {
  await render(
    <ActionGroup>
      <Button>Save</Button>
    </ActionGroup>,
  );

  await expect.element(page.getByRole("group")).toBeInTheDocument();
});

test("the size reaches every button in the group", async () => {
  await render(
    <ActionGroup size="s">
      <Button>Save</Button>
      <Button color="secondary">Cancel</Button>
    </ActionGroup>,
  );

  const sizeClasses = Array.from(document.querySelectorAll("button")).map(
    (button) => button.className.includes("size-s"),
  );

  expect(sizeClasses).toEqual([true, true]);
});
