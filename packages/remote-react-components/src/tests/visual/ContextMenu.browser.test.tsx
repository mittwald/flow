import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

// Basic context menu — only long-standing components, opened via interaction.
// Cross-version safe (works on every published version).
test.each(testEnvironments)(
  "ContextMenu (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ContextMenuTrigger,
      Button,
      ContextMenu,
      MenuItem,
      Separator,
    },
  }) => {
    await render(
      <ContextMenuTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <ContextMenu>
          <MenuItem>Link 1</MenuItem>
          <MenuItem>Link 2</MenuItem>
          <Separator />
          <MenuItem isDisabled>Disabled</MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>,
    );

    await page.getByTestId("trigger").click();

    await testScreenshot("ContextMenu - opened");
  },
);

// Full-featured menu (sections, selection modes, icon, badge, Kbd shortcut).
// Kbd is available from alpha.791.
test.skipIf(crossVersion({ below: "0.2.0-alpha.791" })).each(testEnvironments)(
  "ContextMenu sections and shortcuts (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ContextMenuTrigger,
      Button,
      ContextMenu,
      ContextMenuSection,
      Heading,
      MenuItem,
      Separator,
      IconStar,
      Text,
      Avatar,
      Initials,
      Kbd,
      Badge,
    },
  }) => {
    await render(
      <ContextMenuTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <ContextMenu>
          <ContextMenuSection>
            <MenuItem>
              <Avatar>
                <Initials>Max Mustermann</Initials>
              </Avatar>
            </MenuItem>
            <Heading>Max Mustermann</Heading>
          </ContextMenuSection>
          <Separator />

          <ContextMenuSection selectionMode="switch">
            <MenuItem>Switch</MenuItem>
          </ContextMenuSection>
          <Separator />
          <ContextMenuSection>
            <Heading>Heading</Heading>
            <MenuItem>
              <IconStar />
              <Text>Link 1</Text>
              <Badge>Badge</Badge>
            </MenuItem>
            <MenuItem>
              Link 2<Kbd keys={["mod", "x"]} />
            </MenuItem>
          </ContextMenuSection>
          <Separator />
          <ContextMenuSection
            selectionMode="single"
            defaultSelectedKeys={["radio1"]}
          >
            <MenuItem id="radio1">Radio 1</MenuItem>
            <MenuItem id="radio2">Radio 2</MenuItem>
          </ContextMenuSection>
          <Separator />
          <ContextMenuSection
            selectionMode="multiple"
            defaultSelectedKeys={["checkbox1"]}
          >
            <MenuItem id="checkbox1">Checkbox 1</MenuItem>
            <MenuItem id="checkbox2">Checkbox 2</MenuItem>
          </ContextMenuSection>
          <ContextMenuSection>
            <MenuItem isDisabled>Disabled</MenuItem>
            <MenuItem isPending>Pending</MenuItem>
            <MenuItem isSucceeded>Succeeded</MenuItem>
            <MenuItem isFailed>Failed</MenuItem>
          </ContextMenuSection>
        </ContextMenu>
      </ContextMenuTrigger>,
    );

    await page.getByTestId("trigger").click();

    await testScreenshot("ContextMenu sections and shortcuts");
  },
);
