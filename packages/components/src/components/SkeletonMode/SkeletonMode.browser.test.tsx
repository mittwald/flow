import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { SkeletonMode } from "@/components/SkeletonMode";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { Label } from "@/components/Label";
import { InlineCode } from "@/components/InlineCode";
import { AlertText } from "@/components/AlertText";
import { LabeledValue } from "@/components/LabeledValue";
import { Content } from "@/components/Content";
import { Alert } from "@/components/Alert";
import barStyles from "./components/SkeletonTextContent/SkeletonTextContent.module.scss";
import skeletonTextStyles from "@/components/SkeletonText/SkeletonText.module.scss";

const bars = () =>
  document.querySelectorAll(`.${barStyles.skeletonTextContent}`);

const skeletonTexts = () =>
  document.querySelectorAll(`.${skeletonTextStyles.skeletonText}`);

const status = () => page.getByRole("status");

test("text with content becomes a bar in its own width", async () => {
  await render(
    <SkeletonMode>
      <Heading>example-domain.de</Heading>
      <Text>Subdomain</Text>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect(bars()).toHaveLength(2);
  expect(bars()[0]?.textContent).toBe("example-domain.de");
  expect(skeletonTexts()).toHaveLength(0);
});

test("text without content becomes a SkeletonText", async () => {
  await render(
    <SkeletonMode>
      <Heading />
      <Text />
      <Label />
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect(skeletonTexts()).toHaveLength(3);
  expect(bars()).toHaveLength(0);
});

test("every text component takes part", async () => {
  await render(
    <SkeletonMode>
      <Heading>Heading</Heading>
      <Text>Text</Text>
      <Label>Label</Label>
      <Link href="/">Link</Link>
      <InlineCode>InlineCode</InlineCode>
      <AlertText status="danger">AlertText</AlertText>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect(bars()).toHaveLength(6);
});

test("the text components are inert", async () => {
  await render(
    <SkeletonMode>
      <Heading>Project settings</Heading>
      <Text>Subdomain</Text>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect(document.querySelector("h2")?.hasAttribute("inert")).toBe(true);
  expect(document.querySelector(".flow--text")?.hasAttribute("inert")).toBe(
    true,
  );
});

test("a link is not focusable", async () => {
  await render(
    <>
      <SkeletonMode>
        <Link href="/">Skeleton link</Link>
      </SkeletonMode>
      {/* WebKit skips buttons on Tab, a text input is always tabbable. */}
      <input aria-label="After" />
    </>,
  );

  await expect.element(status()).toBeInTheDocument();
  await userEvent.tab();

  await expect.element(page.getByRole("textbox")).toHaveFocus();
});

test("nested text draws no second bar", async () => {
  await render(
    <SkeletonMode>
      <Text>
        Registered at <Link href="/">example-domain.de</Link>
      </Text>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect(bars()).toHaveLength(1);
});

test("isEnabled={false} renders real UI", async () => {
  await render(
    <SkeletonMode isEnabled={false}>
      <Heading>Project settings</Heading>
    </SkeletonMode>,
  );

  await expect.element(page.getByRole("heading")).toBeInTheDocument();
  expect(bars()).toHaveLength(0);
  await expect.element(status()).not.toBeInTheDocument();
});

test("a nested isEnabled={false} stays focusable and operable", async () => {
  await render(
    <SkeletonMode>
      <Text>Loading</Text>
      <SkeletonMode isEnabled={false}>
        <Link href="/">Real link</Link>
      </SkeletonMode>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  await userEvent.tab();

  await expect.element(page.getByRole("link")).toHaveFocus();
  expect(bars()).toHaveLength(1);
});

test("the loading is announced once", async () => {
  await render(
    <SkeletonMode>
      <SkeletonMode>
        <Text>Nested</Text>
      </SkeletonMode>
      <SkeletonMode isEnabled={false}>
        <SkeletonMode>
          <Text>Nested below an opt-out</Text>
        </SkeletonMode>
      </SkeletonMode>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect(document.querySelectorAll("[role=status]")).toHaveLength(1);
  await expect.element(status()).toHaveTextContent("Loading content");
});

test("switching isEnabled toggles between skeleton and real UI", async () => {
  const screen = await render(
    <SkeletonMode>
      <Heading>Project settings</Heading>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect(document.querySelector("h2")?.hasAttribute("inert")).toBe(true);

  await screen.rerender(
    <SkeletonMode isEnabled={false}>
      <Heading>Project settings</Heading>
    </SkeletonMode>,
  );

  await expect.element(status()).not.toBeInTheDocument();
  expect(document.querySelector("h2")?.hasAttribute("inert")).toBe(false);
  expect(bars()).toHaveLength(0);
});

test("raw text in a container becomes a bar, elements are left alone", async () => {
  await render(
    <SkeletonMode>
      <LabeledValue>
        <Label>Storage</Label>
        <Content>20 GB</Content>
      </LabeledValue>
      <Content>
        <Text>Inside Text</Text>
      </Content>
    </SkeletonMode>,
  );

  await expect.element(status()).toBeInTheDocument();
  expect([...bars()].map((bar) => bar.textContent)).toEqual([
    "Storage",
    "20 GB",
    "Inside Text",
  ]);
});

test("text in a flex container keeps one bar per line", async () => {
  await render(
    <div style={{ width: 240 }}>
      <SkeletonMode>
        <Alert status="danger">
          <Heading>Zertifikat abgelaufen</Heading>
          {/* Alert lays out its Content as a flex column */}
          <Content>
            Die Domain webshop.example-domain.de ist nicht mehr per HTTPS
            erreichbar.
          </Content>
        </Alert>
      </SkeletonMode>
    </div>,
  );

  await expect.element(status()).toBeInTheDocument();
  const bar = bars()[1];
  if (!bar) {
    throw new Error("No bar rendered");
  }
  expect(bar.getClientRects().length).toBeGreaterThan(1);
});
