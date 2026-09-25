import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { AvatarStack } from "@/components/AvatarStack";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";

const overflow = (count: string) => page.getByText(`+${count}`);

const renderStack = (props?: {
  totalCount?: number;
  onCountPress?: () => void;
}) =>
  render(
    <AvatarStack {...props}>
      <Avatar>
        <Initials>Leia Organa</Initials>
      </Avatar>
      <Avatar>
        <Initials>Han Solo</Initials>
      </Avatar>
    </AvatarStack>,
  );

/*
 * `totalCount` is the whole group, not the extra ones – the stack shows the
 * difference to the avatars it actually renders.
 */
test("the overflow counts the members the stack does not show", async () => {
  await renderStack({ totalCount: 7 });

  await expect.element(overflow("5")).toBeVisible();
});

test("a total that the avatars already cover adds no overflow", async () => {
  await renderStack({ totalCount: 2 });

  await expect.element(overflow("0")).not.toBeInTheDocument();
});

test("without a total count there is no overflow", async () => {
  await renderStack();

  await expect.element(page.getByText(/^\+/)).not.toBeInTheDocument();
});

test("the overflow is only a button when a press handler is given", async () => {
  await renderStack({ totalCount: 7 });

  await expect.element(page.getByRole("button")).not.toBeInTheDocument();
});

test("pressing the overflow reports it", async () => {
  const onCountPress = vi.fn();
  await renderStack({ totalCount: 7, onCountPress });

  await page.getByRole("button").click();

  expect(onCountPress).toHaveBeenCalledTimes(1);
});
