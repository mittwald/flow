import {
  ComponentUsageProvider,
  markInternalComposition,
  type ComponentUsageEvent,
} from "@/components/ComponentUsageProvider";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { ViewComponentContextProvider } from "@/lib/viewComponentContext";
import ButtonView from "@/views/ButtonView";
import type { FC, PropsWithChildren, ReactNode } from "react";
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

const usageOf = (events: ComponentUsageEvent[], component: string) =>
  events.filter((event) => event.component === component);

test("reports the components that render", async () => {
  const events = await renderCollecting(
    <Section>
      <Heading>Death Star</Heading>
      <Button>Fire</Button>
    </Section>,
  );

  await expect
    .poll(() => events.map((event) => event.component).toSorted())
    .toEqual(["Button", "Heading", "Section", "Text"]);
});

test("reports consumer-rendered components as direct usage", async () => {
  const events = await renderCollecting(<Button>Fire</Button>);

  await expect
    .poll(() => usageOf(events, "Button"))
    .toEqual([{ component: "Button", isInternalComposition: false }]);
});

test("reports view-resolved components as internal composition", async () => {
  const events = await renderCollecting(
    <ViewComponentContextProvider
      components={{ Button: markInternalComposition(Button) }}
    >
      <ButtonView>Fire</ButtonView>
    </ViewComponentContextProvider>,
  );

  await expect
    .poll(() => usageOf(events, "Button"))
    .toEqual([{ component: "Button", isInternalComposition: true }]);
});

test("attributes the children of an internally composed component to the consumer", async () => {
  const Composed: FC<PropsWithChildren> = ({ children }) => (
    <ViewComponentContextProvider
      components={{ Button: markInternalComposition(Button) }}
    >
      <ButtonView>{children}</ButtonView>
    </ViewComponentContextProvider>
  );

  const events = await renderCollecting(
    <Composed>
      <Text>Fire</Text>
    </Composed>,
  );

  await expect
    .poll(() => usageOf(events, "Button"))
    .toEqual([{ component: "Button", isInternalComposition: true }]);
  expect(usageOf(events, "Text")).toEqual([
    { component: "Text", isInternalComposition: false },
  ]);
});

test("reports every instance, leaving deduplication to the consumer", async () => {
  const events = await renderCollecting(
    <>
      <Button>Fire</Button>
      <Button>Abort</Button>
    </>,
  );

  await expect.poll(() => usageOf(events, "Button")).toHaveLength(2);
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
  expect(usageOf(events, "Button")).toHaveLength(1);
});
