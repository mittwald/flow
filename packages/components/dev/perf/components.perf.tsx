import { beforeAll, test } from "vitest";
import { useState, type FC, type ReactNode } from "react";
import {
  Accordion,
  Alert,
  AlertBadge,
  Avatar,
  Badge,
  Button,
  Checkbox,
  ColumnLayout,
  ComboBox,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  ContextualHelp,
  ContextualHelpTrigger,
  CopyButton,
  CounterBadge,
  DatePicker,
  Heading,
  IconDomain,
  Initials,
  InlineCode,
  Label,
  LabeledValue,
  Link,
  MenuItem,
  Modal,
  ModalTrigger,
  NumberField,
  Option,
  ProgressBar,
  Section,
  Select,
  Switch,
  Tab,
  TabTitle,
  Tabs,
  Text,
  TextArea,
  TextField,
  Tooltip,
  TooltipTrigger,
  Icon,
  Rating,
  SegmentedControl,
  Segment,
  Separator,
  ActionGroup,
  Skeleton,
} from "@/components/public";
import {
  applyThrottle,
  defined,
  measure,
  mount,
  record,
  unmount,
  waitFor,
  type Measurement,
} from "./harness";
import { countFibers } from "./fiberTree";

beforeAll(applyThrottle);

const count = Number(import.meta.env.VITE_PERF_INSTANCES ?? 200);
const runs = Number(import.meta.env.VITE_PERF_RUNS ?? 5);

/* One realistic, minimal usage per component. `i` keeps instances distinct. */
const catalog: Record<string, (i: number) => ReactNode> = {
  "baseline:<span>": (i) => <span>Item {i}</span>,
  "baseline:<button>": (i) => <button>Item {i}</button>,
  Text: (i) => <Text>Item {i}</Text>,
  Heading: (i) => <Heading level={3}>Item {i}</Heading>,
  InlineCode: (i) => <InlineCode>code {i}</InlineCode>,
  Icon: () => (
    <Icon>
      <IconDomain />
    </Icon>
  ),
  Avatar: () => (
    <Avatar>
      <Initials>Max Mustermann</Initials>
    </Avatar>
  ),
  Badge: (i) => <Badge>Badge {i}</Badge>,
  AlertBadge: (i) => <AlertBadge status="warning">Warn {i}</AlertBadge>,
  CounterBadge: (i) => <CounterBadge count={i} />,
  Link: (i) => <Link href={`#${i}`}>Link {i}</Link>,
  Button: (i) => <Button>Button {i}</Button>,
  "Button+Icon": (i) => (
    <Button aria-label={`b${i}`}>
      <IconDomain />
    </Button>
  ),
  CopyButton: (i) => <CopyButton text={`copy ${i}`} />,
  LabeledValue: (i) => (
    <LabeledValue>
      <Label>Label</Label>
      <Content>Value {i}</Content>
    </LabeledValue>
  ),
  Alert: (i) => (
    <Alert>
      <Heading>Alert {i}</Heading>
      <Content>Some content</Content>
    </Alert>
  ),
  ProgressBar: (i) => (
    <ProgressBar value={i % 100}>
      <Label>Progress</Label>
    </ProgressBar>
  ),
  Separator: () => <Separator />,
  Skeleton: () => <Skeleton width={100} height={20} />,
  TextField: (i) => (
    <TextField defaultValue={`value ${i}`}>
      <Label>Field {i}</Label>
    </TextField>
  ),
  TextArea: (i) => (
    <TextArea defaultValue={`value ${i}`}>
      <Label>Area {i}</Label>
    </TextArea>
  ),
  NumberField: (i) => (
    <NumberField defaultValue={i}>
      <Label>Number {i}</Label>
    </NumberField>
  ),
  Checkbox: (i) => <Checkbox>Check {i}</Checkbox>,
  Switch: (i) => <Switch>Switch {i}</Switch>,
  Rating: () => <Rating aria-label="rating" defaultValue={3} />,
  Select: (i) => (
    <Select>
      <Label>Select {i}</Label>
      <Option value="a">Alpha</Option>
      <Option value="b">Bravo</Option>
      <Option value="c">Charlie</Option>
    </Select>
  ),
  ComboBox: (i) => (
    <ComboBox>
      <Label>Combo {i}</Label>
      <Option value="a">Alpha</Option>
      <Option value="b">Bravo</Option>
      <Option value="c">Charlie</Option>
    </ComboBox>
  ),
  DatePicker: (i) => (
    <DatePicker>
      <Label>Date {i}</Label>
    </DatePicker>
  ),
  SegmentedControl: (i) => (
    <SegmentedControl defaultValue="a">
      <Label>Seg {i}</Label>
      <Segment value="a">A</Segment>
      <Segment value="b">B</Segment>
    </SegmentedControl>
  ),
  "ContextMenu (closed)": (i) => (
    <ContextMenu>
      <MenuItem>Edit {i}</MenuItem>
      <MenuItem>Delete</MenuItem>
    </ContextMenu>
  ),
  "ContextMenuTrigger (closed)": (i) => <ContextMenuTriggerFix i={i} />,
  "Tooltip (closed)": (i) => (
    <TooltipTrigger>
      <Button>Hover {i}</Button>
      <Tooltip>Tip</Tooltip>
    </TooltipTrigger>
  ),
  "ContextualHelp (closed)": (i) => (
    <ContextualHelpTrigger>
      <Button>Help {i}</Button>
      <ContextualHelp>
        <Heading>Help</Heading>
        <Text>Text</Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  ),
  "Modal (closed)": (i) => (
    <ModalTrigger>
      <Button>Open {i}</Button>
      <Modal>
        <Heading>Modal</Heading>
        <Content>Content</Content>
      </Modal>
    </ModalTrigger>
  ),
  ActionGroup: (i) => (
    <ActionGroup>
      <Button color="secondary" variant="soft">
        Cancel {i}
      </Button>
      <Button>Save</Button>
    </ActionGroup>
  ),
  Accordion: (i) => (
    <Accordion>
      <Heading>Accordion {i}</Heading>
      <Content>Content</Content>
    </Accordion>
  ),
  Tabs: (i) => (
    <Tabs>
      <Tab>
        <TabTitle>One {i}</TabTitle>
        <Content>1</Content>
      </Tab>
      <Tab>
        <TabTitle>Two</TabTitle>
        <Content>2</Content>
      </Tab>
    </Tabs>
  ),
  Section: (i) => (
    <Section>
      <Heading>Section {i}</Heading>
      <Text>Text</Text>
    </Section>
  ),
  ColumnLayout: (i) => (
    <ColumnLayout>
      <Text>A {i}</Text>
      <Text>B</Text>
    </ColumnLayout>
  ),
};

/* ContextMenu attached to a trigger button, the usual pattern. */
const ContextMenuTriggerFix: FC<{ i: number }> = ({ i }) => (
  <ContextMenuTrigger>
    <Button>Actions {i}</Button>
    <ContextMenu>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Delete</MenuItem>
    </ContextMenu>
  </ContextMenuTrigger>
);

const Grid: FC<{ render: (i: number) => ReactNode }> = ({ render }) => {
  const [n, setN] = useState(0);
  return (
    <div>
      <button data-testid="rerender" onClick={() => setN((x) => x + 1)}>
        {n}
      </button>
      <div data-testid="grid">
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>{render(i)}</div>
        ))}
      </div>
    </div>
  );
};

test.each(Object.keys(catalog))("%s", async (name) => {
  const render = defined(catalog[name], name);
  const mounts: Measurement[] = [];
  let fibers = 0;
  let dom = 0;
  for (let r = 0; r < 3; r++) {
    await unmount();
    const baseDom = document.getElementsByTagName("*").length;
    mounts.push(await measure(() => mount(<Grid render={render} />)));
    await waitFor(
      () =>
        (document.querySelector("[data-testid=grid]")?.childElementCount ??
          0) >= count,
    );
    fibers = countFibers();
    dom = document.getElementsByTagName("*").length - baseDom;
  }
  const rerenders: Measurement[] = [];
  for (let r = 0; r < runs; r++) {
    rerenders.push(
      await measure(() =>
        (
          document.querySelector("[data-testid=rerender]") as HTMLButtonElement
        ).click(),
      ),
    );
  }
  const unmounts = [await measure(() => unmount())];
  await record(
    "component:mount",
    { component: name, instances: count, fibers, dom },
    mounts,
  );
  await record(
    "component:rerender",
    { component: name, instances: count },
    rerenders,
  );
  await record(
    "component:unmount",
    { component: name, instances: count },
    unmounts,
  );
});
