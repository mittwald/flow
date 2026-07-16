// Remote entries for the cross-version HTML-output comparison. Each export is
// a deterministic (no time/random) render of a component in a representative
// state. Components are imported from the PACKAGE SPECIFIER so the version
// alias in `../vite.config.ts` resolves them to the selected version (an
// installed old version, or the workspace `src` when generating references).
//
// The host (`../entries.browser.test.tsx`) renders each of these through the
// current `RemoteRenderer`, normalizes the resulting HTML, and compares it to a
// version-independent reference in `../__html__/`.
import {
  Badge,
  Button,
  Checkbox,
  CounterBadge,
  Heading,
  Label,
  Link,
  Switch,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";

export const buttonDefault = () => <Button data-testid="button">Save</Button>;

export const buttonDisabled = () => (
  <Button data-testid="button" isDisabled>
    Save
  </Button>
);

export const buttonSoftDanger = () => (
  <Button data-testid="button" variant="soft" color="danger">
    Delete
  </Button>
);

export const checkboxDefault = () => (
  <Checkbox data-testid="checkbox">Accept terms</Checkbox>
);

export const checkboxSelected = () => (
  <Checkbox data-testid="checkbox" isSelected>
    Accept terms
  </Checkbox>
);

export const switchSelected = () => (
  <Switch data-testid="switch" defaultSelected>
    <Label>Notifications</Label>
  </Switch>
);

export const badgeColor = () => (
  <Badge data-testid="badge" color="green">
    Active
  </Badge>
);

export const counterBadge = () => (
  <CounterBadge data-testid="counter" count={7} />
);

export const text = () => <Text data-testid="text">Hello world</Text>;

export const heading = () => (
  <Heading data-testid="heading" level={2}>
    Section title
  </Heading>
);

export const link = () => (
  <Link data-testid="link" href="https://example.com/">
    Documentation
  </Link>
);

export const textField = () => (
  <TextField data-testid="field">
    <Label>Name</Label>
  </TextField>
);
