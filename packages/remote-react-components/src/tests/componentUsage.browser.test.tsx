import RemoteRoot from "@/components/RemoteRoot";
import {
  Accordion,
  Button,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
} from "@/index";
import { RootContainer, rootContainerLocator } from "@/tests/lib/RootContainer";
import { NotificationProvider } from "@mittwald/flow-react-components";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import {
  RemoteRenderer,
  type ComponentUsageEvent,
} from "@mittwald/flow-remote-react-renderer";
import {
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { expect, test } from "vitest";
import { cleanup, render } from "vitest-browser-react";

interface CollectingUiProps extends PropsWithChildren {
  onUsage: (event: ComponentUsageEvent) => void;
}

const CollectingUi: FC<CollectingUiProps> = ({ onUsage, children }) => {
  const receiver = useMemo(() => new RemoteReceiver(), []);

  return (
    <RootContainer>
      <RemoteRenderer __remoteReceiver={receiver} onComponentUsage={onUsage} />
      <RemoteRoot __remoteReceiver={receiver}>
        <NotificationProvider>{children}</NotificationProvider>
      </RemoteRoot>
    </RootContainer>
  );
};

const renderCollecting = async (
  ui: ReactNode,
): Promise<ComponentUsageEvent[]> => {
  await cleanup();
  const events: ComponentUsageEvent[] = [];
  await render(
    <CollectingUi onUsage={(event) => events.push(event)}>{ui}</CollectingUi>,
  );
  return events;
};

const componentsOf = (events: ComponentUsageEvent[]): string[] =>
  events.map((event) => event.component);

test("reports every component the remote renders", async () => {
  const events = await renderCollecting(
    <>
      <Heading>Death Star</Heading>
      <Button>Fire</Button>
      <Text>An armored space station.</Text>
    </>,
  );

  await expect
    .poll(() => componentsOf(events).toSorted())
    .toEqual(["Button", "Heading", "Text"]);
});

test("reports nested components", async () => {
  const events = await renderCollecting(
    <Table aria-label="Weapons">
      <TableHeader>
        <TableColumn>Weapon</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Superlaser</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  await expect
    .poll(() => componentsOf(events).toSorted())
    .toEqual([
      "Table",
      "TableBody",
      "TableCell",
      "TableColumn",
      "TableHeader",
      "TableRow",
    ]);
});

test("reports a component once, not per instance", async () => {
  const events = await renderCollecting(
    <>
      <Button>Fire</Button>
      <Button>Abort</Button>
      <Button>Retry</Button>
    </>,
  );

  await expect
    .poll(() => rootContainerLocator.getByRole("button").all())
    .toHaveLength(3);
  expect(componentsOf(events)).toEqual(["Button"]);
});

test("reports a component once across re-renders", async () => {
  const Repeating: FC = () => {
    const [count, setCount] = useState(0);

    return (
      <Button onPress={() => setCount(count + 1)}>Fired {count} times</Button>
    );
  };

  const events = await renderCollecting(<Repeating />);
  const button = rootContainerLocator.getByRole("button");
  await button.click();
  await button.click();

  await expect.element(button).toHaveTextContent("Fired 2 times");
  expect(componentsOf(events)).toEqual(["Button"]);
});

test("attaches the lifecycle status from the registry", async () => {
  const events = await renderCollecting(
    <Accordion>
      <Heading>Death Star</Heading>
      <Text>An armored space station.</Text>
    </Accordion>,
  );

  await expect
    .poll(() => events.find((event) => event.component === "Accordion")?.status)
    .toEqual({ level: "beta", isNew: false });
  expect(events.find((event) => event.component === "Heading")?.status).toEqual(
    {
      level: "stable",
      isNew: false,
    },
  );
});

test("leaves the status undefined for components outside the registry", async () => {
  const events = await renderCollecting(
    <Table aria-label="Weapons">
      <TableHeader>
        <TableColumn>Weapon</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Superlaser</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  await expect
    .poll(() => events.find((event) => event.component === "Table")?.status)
    .toEqual({ level: "stable", isNew: false });
  expect(
    events.find((event) => event.component === "TableCell")?.status,
  ).toBeUndefined();
});
