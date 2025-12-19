import { test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";

test.each(testEnvironments)(
  "ActionGroup (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, ActionGroup, Button, Switch, Link, Separator },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <ActionGroup>
          <Button>Primary</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
        <Separator />
        <ActionGroup>
          <Button>Primary</Button>
        </ActionGroup>
        <Separator />
        <ActionGroup>
          <Button>Primary</Button>
          <Button slot="secondary" variant="soft" color="secondary">
            Secondary
          </Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
        <Separator />
        <ActionGroup>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
        <Separator />
        <ActionGroup>
          <Button>Primary</Button>
          <Switch>Switch</Switch>
        </ActionGroup>
        <Separator />
        <ActionGroup>
          <Link slot="abort">Link</Link>
          <Button>Primary</Button>
        </ActionGroup>
      </Flex>,
    );

    await testScreenshot("ActionGroup");
  },
);
