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
  "ActionGroup preserveOrder (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, ActionGroup, Button, Separator },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <ActionGroup preserveOrder>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
          <Button color="accent">Create customer</Button>
          <Button variant="soft" color="secondary">
            Save as draft
          </Button>
        </ActionGroup>
        <Separator />
        <ActionGroup preserveOrder>
          <Button color="accent">Primary</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
      </Flex>,
    );

    await testScreenshot("ActionGroup-preserveOrder");
  },
);

test.each(testEnvironments)(
  "ActionGroup size (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, ActionGroup, Button, Link, Separator },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <ActionGroup size="s">
          <Link slot="secondary">Link</Link>
          <Button>Primary</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
        <Separator />
        <ActionGroup size="m">
          <Link slot="secondary">Link</Link>
          <Button>Primary</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </ActionGroup>
      </Flex>,
    );

    await testScreenshot("ActionGroup-size");
  },
);
