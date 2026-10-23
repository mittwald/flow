import { beforeAll, test } from "vitest";
import { useState, type FC, type ReactNode } from "react";
import {
  ActionGroup,
  Action,
  Area,
  Avatar,
  Bar,
  Button,
  CartesianChart,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  CodeBlock,
  CodeEditor,
  ComboBox,
  Combine,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  CountryOptions,
  DatePicker,
  DateRangePicker,
  DonutChart,
  Header,
  Heading,
  Initials,
  InlineCode,
  Label,
  Link,
  Markdown,
  MarkdownEditor,
  MenuItem,
  Message,
  MessageThread,
  Modal,
  ModalTrigger,
  Option,
  Section,
  Select,
  Tab,
  TabNavigation,
  TabTitle,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Text,
  TextField,
  Truncate,
  XAxis,
  YAxis,
} from "@/components/public";
import {
  applyThrottle,
  defined,
  measure,
  mount,
  record,
  unmount,
  type Measurement,
} from "./harness";
import { countFibers } from "./fiberTree";
import { commands } from "vitest/browser";

beforeAll(applyThrottle);
/*
 * CartesianChart animates unless the user prefers reduced motion; the
 * measurement would end with the animation instead of the render.
 */
beforeAll(() => commands.setReducedMotion("reduce"));

const runs = Number(import.meta.env.VITE_PERF_RUNS ?? 5);

/**
 * A component whose cost grows with its input — a parser, a highlighter, a
 * chart, a large collection — or that does real work on an interaction.
 */
interface Scenario {
  /** What `size` counts, e.g. "sections" or "data points". */
  unit: string;
  sizes: number[];
  /**
   * `version` bumps on "update": the content changes slightly, like an edit or
   * a data refresh. A parent re-render keeps it.
   */
  render: (size: number, version: number) => ReactNode;
  /** Content is complete; checked once the measurement settled. */
  ready?: (size: number) => boolean;
  /** Skip the "update" measurement (`render` ignores `version`). */
  static?: boolean;
  /** An interaction measured on a fresh mount, e.g. opening the popover. */
  interaction?: {
    name: string;
    target: () => HTMLElement | null;
    done: (size: number) => boolean;
  };
}

/* The scenario's own content, without the host's re-render buttons. */
const content = () =>
  defined(
    document.querySelector<HTMLElement>("[data-testid=content]"),
    "mounted content",
  );
const count = (selector: string, root: ParentNode = document) =>
  root.querySelectorAll(selector).length;
const button = (pattern: RegExp, root: ParentNode = content()) =>
  ([...root.querySelectorAll("button")].find((b) =>
    pattern.test(b.getAttribute("aria-label") ?? b.textContent ?? ""),
  ) ?? null) as HTMLElement | null;
/*
 * A mouse press as react-aria sees it. `element.click()` is a virtual click,
 * which some triggers (Select, ComboBox) ignore; zero-sized pointer events
 * count as virtual too.
 */
const press = (element: HTMLElement) => {
  const init = {
    bubbles: true,
    cancelable: true,
    composed: true,
    button: 0,
    pointerId: 1,
    pointerType: "mouse",
    isPrimary: true,
    width: 1,
    height: 1,
  };
  element.dispatchEvent(new PointerEvent("pointerdown", init));
  element.dispatchEvent(new MouseEvent("mousedown", init));
  element.dispatchEvent(new PointerEvent("pointerup", init));
  element.dispatchEvent(new MouseEvent("mouseup", init));
  element.dispatchEvent(new MouseEvent("click", { ...init, detail: 1 }));
};
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* Typical content of a support ticket or a changelog entry. */
const markdownSection = (i: number, version: number) => `## Section ${i}

A paragraph with **bold**, _italic_, a [link](https://example.com/${i}) and
\`inline code\`. Revision ${i === 0 ? version : 0}.

- first item
- second item with \`code\`
- third item

| Name  | Value |
| ----- | ----- |
| alpha | ${i}  |
| bravo | ${i * 2} |
`;

const codeLines = (n: number, version: number) =>
  range(n)
    .map((i) =>
      i === 0
        ? `// revision ${version}`
        : `export const value${i} = compute(${i}, "item-${i}"); // line ${i}`,
    )
    .join("\n");

const markdownDocument = (sections: number, version: number) =>
  range(sections)
    .map((i) => markdownSection(i, version))
    .join("\n");

const markdownWithCode = (blocks: number, version: number) =>
  range(blocks)
    .map(
      (i) =>
        `${markdownSection(i, version)}\n\`\`\`ts\n${codeLines(10, i === 0 ? version : 0)}\n\`\`\`\n`,
    )
    .join("\n");

const chartData = (n: number, version: number) =>
  range(n).map((i) => ({
    name: `P${i}`,
    first: Math.round(2000 + 1500 * Math.sin(i / 7 + version)),
    second: Math.round(3000 + 1000 * Math.cos(i / 5)),
    third: Math.round(2500 + 800 * Math.sin(i / 3)),
  }));

const chartReady = () => count(".recharts-surface", content()) > 0;

const TicketMessage: FC<{ i: number; body: ReactNode }> = ({ i, body }) => (
  <Message type={i % 2 ? "responder" : "sender"}>
    <Header>
      <Combine>
        <Avatar>
          <Initials>{i % 2 ? "John Doe" : "Max Mustermann"}</Initials>
        </Avatar>
        <Text>
          <strong>{i % 2 ? "John Doe" : "Max Mustermann"}</strong>
        </Text>
      </Combine>
    </Header>
    <Content>{body}</Content>
  </Message>
);

const ticketText = (
  i: number,
) => `Hello, my domain **example-${i}.de** stopped resolving
after the move. I already checked:

- the DNS zone
- the \`A\` record

See [the docs](https://example.com) for what I tried.`;

const scenarios: Record<string, Scenario> = {
  Markdown: {
    unit: "sections",
    sizes: [1, 10, 50],
    render: (n, v) => <Markdown>{markdownDocument(n, v)}</Markdown>,
    ready: (n) => count("table", content()) === n,
  },
  "Markdown with code blocks": {
    unit: "code blocks",
    sizes: [1, 10, 50],
    render: (n, v) => <Markdown>{markdownWithCode(n, v)}</Markdown>,
    ready: (n) => count(".cm-editor", content()) === n,
  },
  "MessageThread, Text": {
    unit: "messages",
    sizes: [10, 50, 200],
    static: true,
    render: (n) => (
      <MessageThread>
        {range(n).map((i) => (
          <TicketMessage key={i} i={i} body={<Text>{ticketText(i)}</Text>} />
        ))}
      </MessageThread>
    ),
  },
  "MessageThread, Markdown": {
    unit: "messages",
    sizes: [10, 50, 200],
    static: true,
    render: (n) => (
      <MessageThread>
        {range(n).map((i) => (
          <TicketMessage
            key={i}
            i={i}
            body={<Markdown>{ticketText(i)}</Markdown>}
          />
        ))}
      </MessageThread>
    ),
    ready: (n) => count('a[href="https://example.com"]', content()) === n,
  },
  CodeBlock: {
    unit: "lines",
    sizes: [20, 200, 2000],
    render: (n, v) => <CodeBlock language="ts" code={codeLines(n, v)} />,
    ready: () => count(".cm-content", content()) === 1,
  },
  CodeEditor: {
    unit: "lines",
    sizes: [20, 200, 2000],
    render: (n, v) => (
      <CodeEditor language="ts" value={codeLines(n, v)}>
        <Label>Source code</Label>
      </CodeEditor>
    ),
    ready: () => count(".cm-content", content()) === 1,
  },
  MarkdownEditor: {
    unit: "sections",
    sizes: [1, 10, 50],
    render: (n, v) => (
      <MarkdownEditor value={markdownDocument(n, v)} onChange={() => undefined}>
        <Label>Message</Label>
      </MarkdownEditor>
    ),
    interaction: {
      name: "preview",
      target: () => button(/^(Preview|Vorschau)$/),
      done: (n) => count("table", content()) === n,
    },
  },
  "CartesianChart, Area": {
    unit: "data points",
    sizes: [10, 100, 1000],
    render: (n, v) => (
      <CartesianChart data={chartData(n, v)} height="300px">
        <Area dataKey="first" />
        <Area dataKey="second" color="palatinate-blue" />
        <Area dataKey="third" color="#555" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartGrid />
        <ChartLegend />
        <ChartTooltip />
      </CartesianChart>
    ),
    ready: chartReady,
  },
  "CartesianChart, Bar": {
    unit: "data points",
    sizes: [10, 100, 1000],
    render: (n, v) => (
      <CartesianChart data={chartData(n, v)} height="300px">
        <Bar dataKey="first" />
        <Bar dataKey="second" color="palatinate-blue" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartGrid />
        <ChartLegend />
        <ChartTooltip />
      </CartesianChart>
    ),
    ready: chartReady,
  },
  DonutChart: {
    unit: "instances",
    sizes: [1, 10, 50],
    render: (n, v) => (
      <>
        {range(n).map((i) => (
          <DonutChart
            key={i}
            aria-label={`Storage ${i}`}
            showLegend
            legendPosition="right"
            segments={[
              { title: "Mails", value: 28 + v },
              { title: "Databases", value: 24 },
              { title: "Backups", value: 8 },
              { title: "Apps", value: 10 },
            ]}
          />
        ))}
      </>
    ),
  },
  Table: {
    unit: "rows",
    sizes: [20, 100, 500],
    render: (n, v) => (
      <Table aria-label="Domains">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Target</TableColumn>
          <TableColumn>TTL</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {range(n).map((i) => (
            <TableRow key={i}>
              <TableCell>
                <InlineCode>sub{i}.example.de</InlineCode>
              </TableCell>
              <TableCell>A</TableCell>
              <TableCell>203.0.113.{i % 255}</TableCell>
              <TableCell>{i === 0 ? 3600 + v : 3600}</TableCell>
              <TableCell>verified</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
    ready: (n) => count("tbody tr", content()) === n,
  },
  "Select, open": {
    unit: "options",
    sizes: [10, 100, 1000],
    static: true,
    render: (n) => (
      <Select>
        <Label>Option</Label>
        {range(n).map((i) => (
          <Option key={i} value={`o${i}`}>
            Option {i}
          </Option>
        ))}
      </Select>
    ),
    interaction: {
      name: "open",
      target: () => content().querySelector("button"),
      done: (n) => count("[role=option]") === n,
    },
  },
  "ComboBox + CountryOptions, open": {
    unit: "instances",
    sizes: [1],
    static: true,
    render: () => (
      <ComboBox>
        <Label>Country</Label>
        <CountryOptions />
      </ComboBox>
    ),
    interaction: {
      name: "open",
      target: () => content().querySelector("button"),
      done: () => count("[role=option]") > 200,
    },
  },
  "DatePicker, open": {
    unit: "instances",
    sizes: [1],
    static: true,
    render: () => (
      <DatePicker>
        <Label>Date</Label>
      </DatePicker>
    ),
    interaction: {
      name: "open",
      target: () => content().querySelector("button"),
      done: () => count("[role=grid]") === 1,
    },
  },
  "DateRangePicker, open": {
    unit: "instances",
    sizes: [1],
    static: true,
    render: () => (
      <DateRangePicker>
        <Label>Period</Label>
      </DateRangePicker>
    ),
    interaction: {
      name: "open",
      target: () => content().querySelector("button"),
      done: () => count("[role=grid]") >= 1,
    },
  },
  "ContextMenu, open": {
    unit: "menu items",
    sizes: [5, 20],
    static: true,
    render: (n) => (
      <ContextMenuTrigger>
        <Button>Actions</Button>
        <ContextMenu>
          {range(n).map((i) => (
            <MenuItem key={i}>Action {i}</MenuItem>
          ))}
        </ContextMenu>
      </ContextMenuTrigger>
    ),
    interaction: {
      name: "open",
      target: () => button(/^Actions$/),
      done: (n) => count("[role=menuitem]") === n,
    },
  },
  "Modal with form, open": {
    unit: "fields",
    sizes: [5, 20],
    static: true,
    render: (n) => (
      <ModalTrigger>
        <Button>Edit</Button>
        <Modal>
          <Heading>Edit domain</Heading>
          <Content>
            <Section>
              {range(n).map((i) => (
                <TextField key={i} defaultValue={`value ${i}`}>
                  <Label>Field {i}</Label>
                </TextField>
              ))}
            </Section>
          </Content>
          <ActionGroup>
            <Action closeModal>
              <Button color="success">Save</Button>
              <Button color="secondary" variant="soft">
                Cancel
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>
    ),
    interaction: {
      name: "open",
      target: () => button(/^Edit$/),
      done: (n) => count("[role=dialog] input") === n,
    },
  },
  Tabs: {
    unit: "tabs",
    sizes: [5, 20, 50],
    static: true,
    render: (n) => (
      <Tabs>
        {range(n).map((i) => (
          <Tab key={i}>
            <TabTitle>Tab {i}</TabTitle>
            <Content>Content {i}</Content>
          </Tab>
        ))}
      </Tabs>
    ),
  },
  TabNavigation: {
    unit: "links",
    sizes: [5, 20, 50],
    static: true,
    render: (n) => (
      <TabNavigation aria-label="Project">
        {range(n).map((i) => (
          <Link
            key={i}
            href={`#${i}`}
            aria-current={i === 0 ? "page" : undefined}
          >
            Section {i}
          </Link>
        ))}
      </TabNavigation>
    ),
  },
  "Truncate (offset)": {
    unit: "instances",
    sizes: [10, 100, 500],
    static: true,
    render: (n) => (
      <div style={{ width: 200 }}>
        {range(n).map((i) => (
          <Truncate key={i} offset={8}>
            {`very-long-subdomain-name-${i}.customer-project.example.de`}
          </Truncate>
        ))}
      </div>
    ),
  },
};

const Host: FC<{ scenario: Scenario; size: number }> = ({ scenario, size }) => {
  const [tick, setTick] = useState(0);
  const [version, setVersion] = useState(0);
  return (
    <div>
      <button data-testid="rerender" onClick={() => setTick((x) => x + 1)}>
        {tick}
      </button>
      <button data-testid="update" onClick={() => setVersion((x) => x + 1)}>
        {version}
      </button>
      <div data-testid="content" style={{ width: 960 }}>
        {scenario.render(size, version)}
      </div>
    </div>
  );
};

const click = (testId: string) => () =>
  (
    defined(
      document.querySelector(`[data-testid=${testId}]`),
      testId,
    ) as HTMLButtonElement
  ).click();

/* A measurement that settled before the content was complete is bogus. */
const assertReady = (scenario: Scenario, size: number, what: string) => {
  if (scenario.ready && !scenario.ready(size)) {
    throw new Error(`${what}: content incomplete when the measurement ended`);
  }
};

const cases = Object.entries(scenarios).flatMap(([name, scenario]) =>
  scenario.sizes.map((size) => [name, size] as const),
);

test.each(cases)("%s, %i", async (name, size) => {
  const scenario = defined(scenarios[name], name);
  const params = { component: name, size, unit: scenario.unit };

  const mounts: Measurement[] = [];
  let fibers = 0;
  let dom = 0;
  for (let r = 0; r < 3; r++) {
    await unmount();
    const baseDom = document.getElementsByTagName("*").length;
    mounts.push(
      await measure(() => mount(<Host scenario={scenario} size={size} />)),
    );
    assertReady(scenario, size, `${name} mount`);
    fibers = countFibers();
    dom = document.getElementsByTagName("*").length - baseDom;
  }
  await record("heavy:mount", { ...params, fibers, dom }, mounts);

  const rerenders: Measurement[] = [];
  for (let r = 0; r < runs; r++) {
    rerenders.push(await measure(click("rerender")));
  }
  await record("heavy:rerender", params, rerenders);

  if (!scenario.static) {
    const updates: Measurement[] = [];
    for (let r = 0; r < runs; r++) {
      updates.push(await measure(click("update")));
      assertReady(scenario, size, `${name} update`);
    }
    await record("heavy:update", params, updates);
  }

  const { interaction } = scenario;
  if (interaction) {
    const interactions: Measurement[] = [];
    for (let r = 0; r < runs; r++) {
      await unmount();
      // let the mount settle, so it does not leak into the interaction
      await measure(() => mount(<Host scenario={scenario} size={size} />));
      const target = defined(interaction.target(), `${name} trigger`);
      interactions.push(await measure(() => press(target)));
      if (!interaction.done(size)) {
        throw new Error(
          `${name} ${interaction.name}: incomplete when the measurement ended`,
        );
      }
    }
    await record(`heavy:${interaction.name}`, params, interactions);
  }

  await unmount();
});
