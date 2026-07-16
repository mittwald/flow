// TEMPORARY remote entry proving the cross-version server (Task R1) starts and
// serves an old version's remote UI. R2 replaces this with the real
// screenshot-driving entries. Components are imported from the PACKAGE
// SPECIFIER so the version alias resolves them to the selected OLD version.
import { Button } from "@mittwald/flow-remote-react-components";

export const smoke = () => (
  <Button data-testid="smoke-button" isDisabled>
    ok
  </Button>
);
