import {
  ComponentUsageProvider,
  type ComponentUsageEvent,
} from "@/components/ComponentUsageProvider";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import { ViewComponentContextProvider } from "@/lib/viewComponentContext";
import ButtonView from "@/views/ButtonView";
import { Text } from "@/components/Text";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

const renderCollecting = async (
  ui: ReactNode,
): Promise<ComponentUsageEvent[]> => {
  const events: ComponentUsageEvent[] = [];
  await render(
    <ComponentUsageProvider onUsage={(event) => events.push(event)}>
      {ui}
    </ComponentUsageProvider>,
  );
  return events;
};

const componentsOf = (events: ComponentUsageEvent[]) =>
  events.map((event) => event.component);

test("reports the components that render", async () => {
  const events = await renderCollecting(
    <Section>
      <Heading>Death Star</Heading>
      <Button>Fire</Button>
    </Section>,
  );

  await expect
    .poll(() => componentsOf(events))
    .toEqual(expect.arrayContaining(["Section", "Heading", "Button"]));
});

test("over-reports a composition that bypasses its view", async () => {
  // Known limitation, pinned on purpose: the exclusion sits at the view seam, so
  // Button rendering <Text> directly instead of TextView lands in the consumer's
  // bucket. Polling on Button is the flush gate — React runs the child's mount
  // effect first, so once Button is in, Text is too.
  const events = await renderCollecting(<Button>Fire</Button>);

  await expect.poll(() => componentsOf(events)).toContain("Button");
  expect(componentsOf(events)).toContain("Text");
});

test("reports every instance, leaving deduplication to the consumer", async () => {
  const events = await renderCollecting(
    <>
      <Button>Fire</Button>
      <Button>Abort</Button>
    </>,
  );

  await expect
    .poll(() => componentsOf(events).filter((c) => c === "Button"))
    .toHaveLength(2);
});

test("does not report again when a component re-renders", async () => {
  const Repeating: FC = () => {
    const [count, setCount] = useState(0);
    return (
      <Button onPress={() => setCount(count + 1)}>Fired {count} times</Button>
    );
  };

  const events = await renderCollecting(<Repeating />);
  const button = page.getByRole("button");
  await button.click();
  await button.click();

  await expect.element(button).toHaveTextContent("Fired 2 times");
  expect(componentsOf(events).filter((c) => c === "Button")).toHaveLength(1);
});

test("does not report a component reached through a view", async () => {
  const events = await renderCollecting(
    <ViewComponentContextProvider components={{ Button }}>
      <Section>
        <ButtonView>Fire</ButtonView>
      </Section>
    </ViewComponentContextProvider>,
  );

  // Section proves the reporting path ran, so the missing Button is a decision
  // and not a race.
  await expect.poll(() => componentsOf(events)).toContain("Section");
  expect(componentsOf(events)).not.toContain("Button");
});

test("attributes the children of a view-composed component to the consumer", async () => {
  const Composed: FC<{ children: ReactNode }> = ({ children }) => (
    <ViewComponentContextProvider components={{ Button }}>
      <ButtonView>{children}</ButtonView>
    </ViewComponentContextProvider>
  );

  const events = await renderCollecting(
    <Composed>
      <Text>Fire</Text>
    </Composed>,
  );

  await expect.poll(() => componentsOf(events)).toContain("Text");
  expect(componentsOf(events)).not.toContain("Button");
});

test("reports nothing without a handler", async () => {
  // A host that does not collect usage pays a context read and nothing else —
  // rendering must not depend on the provider being configured.
  await render(
    <ComponentUsageProvider>
      <Button>Fire</Button>
    </ComponentUsageProvider>,
  );

  await expect.element(page.getByRole("button")).toBeInTheDocument();
});
