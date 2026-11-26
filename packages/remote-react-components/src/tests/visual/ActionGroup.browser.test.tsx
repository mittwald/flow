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

test.each(testEnvironments)(
  "ActionGroup preserveOrder and size (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, ActionGroup, Button, Link },
  }) => {
    await render(
      <Flex direction="column" gap="xl">
        <ActionGroup preserveOrder>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
          <Button color="success">Create customer</Button>
          <Button variant="soft" color="secondary">
            Save as draft
          </Button>
        </ActionGroup>
        <ActionGroup preserveOrder>
          <Button color="success">Primary</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
        <ActionGroup size="s">
          <Link slot="secondary">Link</Link>
          <Button>Primary</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
        <ActionGroup size="m">
          <Link slot="secondary">Link</Link>
          <Button>Primary</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
      </Flex>,
    );

    await testScreenshot("ActionGroup preserveOrder and size");
  },
);
