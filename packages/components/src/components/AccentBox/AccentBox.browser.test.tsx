import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { AccentBox } from "@/components/AccentBox";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";
import { LayoutCard } from "@/components/LayoutCard";
import { PropsContextProvider } from "@/lib/propsContext";

const renderBox = async () => {
  const onAction = vi.fn();
  const onDetails = vi.fn();

  await render(
    <AccentBox>
      <Heading>Demo persona</Heading>
      <Text>Sees the dashboard as a new customer.</Text>
      <Button slot="action" onPress={onAction}>
        Select
      </Button>
      <Link onPress={onDetails}>Details</Link>
    </AccentBox>,
  );

  return { onAction, onDetails };
};

/* The action covers the text, so playwright would refuse a plain click
   with "intercepts pointer events" – which is exactly the point. */
test("A click anywhere in the box presses the action", async () => {
  const { onAction } = await renderBox();

  await page
    .getByText("Sees the dashboard as a new customer.")
    .click({ force: true });

  expect(onAction).toHaveBeenCalledOnce();
});

test("Other links in the box stay clickable on their own", async () => {
  const { onAction, onDetails } = await renderBox();

  await page.getByRole("link", { name: "Details" }).click();

  expect(onDetails).toHaveBeenCalledOnce();
  expect(onAction).not.toHaveBeenCalled();
});

test("A button styled through another props context stays clickable", async () => {
  const onAction = vi.fn();
  const onInstall = vi.fn();

  await render(
    <AccentBox>
      <PropsContextProvider props={{ Button: { className: "tile-button" } }}>
        <Link slot="action" aria-label="WordPress" onPress={onAction} />
        <Heading>WordPress</Heading>
        <Button onPress={onInstall}>Install</Button>
      </PropsContextProvider>
    </AccentBox>,
  );

  await page.getByRole("button", { name: "Install" }).click();

  expect(onInstall).toHaveBeenCalledOnce();
  expect(onAction).not.toHaveBeenCalled();
});

/* The hover is a CSS custom property the hover layer reads, so the tests
   assert it instead of a screenshot (which resets the pointer). */
const hoverOverlayOpacity = (box: Element) =>
  getComputedStyle(box).getPropertyValue("--hover-overlay-opacity").trim();

test("Hovering the action shows the hover on the box", async () => {
  await render(
    <>
      <Button>Elsewhere</Button>
      <AccentBox>
        <Heading>WordPress</Heading>
        <Link slot="action" href="#">
          Show WordPress template
        </Link>
      </AccentBox>
    </>,
  );

  // react-aria counts a hover only once the pointer modality is set
  await page.getByRole("button", { name: "Elsewhere" }).click();
  await userEvent.hover(
    page.getByRole("link", { name: "Show WordPress template" }),
  );

  const box = page
    .getByRole("heading", { name: "WordPress" })
    .element()
    .closest(".flow--accent-box");
  if (!box) {
    throw new Error("AccentBox not rendered");
  }
  await expect.poll(() => hoverOverlayOpacity(box)).toBe("1");
});

test("A Link around a LayoutCard shows the hover on the box", async () => {
  await render(
    <>
      <Button>Elsewhere</Button>
      <Link href="#">
        <LayoutCard>
          <AccentBox>Linked box in a LayoutCard</AccentBox>
        </LayoutCard>
      </Link>
    </>,
  );

  await page.getByRole("button", { name: "Elsewhere" }).click();
  const box = page.getByText("Linked box in a LayoutCard");
  await userEvent.hover(box);

  await expect.poll(() => hoverOverlayOpacity(box.element())).toBe("1");
});
