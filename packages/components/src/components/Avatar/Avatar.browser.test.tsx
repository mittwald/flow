import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";

test("avatar is decorative and hidden from assistive technology by default", async () => {
  await render(
    <Avatar>
      <Initials>Luke Skywalker</Initials>
    </Avatar>,
  );

  const image = page.getByRole("img", { includeHidden: false });
  await expect.element(image).not.toBeInTheDocument();
});

test("a labelled avatar is exposed as a single labelled image", async () => {
  await render(
    <Avatar label="Luke Skywalker">
      <Initials>Luke Skywalker</Initials>
    </Avatar>,
  );

  // The whole avatar is announced as one unit, not as separate letters.
  const image = page.getByRole("img", { includeHidden: false });
  await expect.element(image).toHaveAccessibleName("Luke Skywalker");
});
