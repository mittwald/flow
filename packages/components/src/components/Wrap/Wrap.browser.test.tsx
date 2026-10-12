import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Wrap } from "@/components/Wrap";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";

/*
 * `Wrap` decides whether its single child wraps the content or steps aside –
 * the content itself is rendered either way, which is what makes an optional
 * link or container possible without duplicating the children.
 */
test("a truthy condition keeps the wrapping element", async () => {
  await render(
    <Wrap if={true}>
      <Link href="#project">
        <Text>Project settings</Text>
      </Link>
    </Wrap>,
  );

  await expect
    .element(page.getByRole("link", { name: "Project settings" }))
    .toBeInTheDocument();
});

test("a falsy condition drops the wrapping element but keeps the content", async () => {
  await render(
    <Wrap if={false}>
      <Link href="#project">
        <Text>Project settings</Text>
      </Link>
    </Wrap>,
  );

  await expect.element(page.getByRole("link")).not.toBeInTheDocument();
  await expect.element(page.getByText("Project settings")).toBeVisible();
});

test("the condition is any value, not only a boolean", async () => {
  await render(
    <Wrap if={undefined}>
      <Link href="#project">
        <Text>Project settings</Text>
      </Link>
    </Wrap>,
  );

  await expect.element(page.getByRole("link")).not.toBeInTheDocument();
});
