import { crossVersion, testEnvironments } from "@/tests/lib/environments";

// showSelectAll exists from 1.4.0-next.6.
const selectAllFrom = "1.4.0-next.6";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

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
                <Initials>Luke Skywalker</Initials>
              </Avatar>
            </MenuItem>
            <Heading>Luke Skywalker</Heading>
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

test.skipIf(crossVersion({ below: selectAllFrom })).each(testEnvironments)(
  "ContextMenu with select all (%s)",
  async ({
    testScreenshot,
    render,
    components: { ContextMenuTrigger, Button, ContextMenu, MenuItem },
  }) => {
    await render(
      <ContextMenuTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <ContextMenu
          selectionMode="multiple"
          showSelectAll
          defaultSelectedKeys={["hoth"]}
        >
          <MenuItem id="alderaan">Alderaan</MenuItem>
          <MenuItem id="hoth">Hoth</MenuItem>
          <MenuItem id="endor">Endor</MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>,
    );

    await page.getByTestId("trigger").click();
    await testScreenshot("ContextMenu select all - partially selected");

    await page.getByRole("menuitem", { name: "Select all" }).click();
    await testScreenshot("ContextMenu select all - all selected");
  },
);

// ItemAction exists from 1.8.0-next.2.
test.skipIf(crossVersion({ below: "1.8.0-next.2" })).each(testEnvironments)(
  "ContextMenu with item actions (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ContextMenuTrigger,
      Button,
      ContextMenu,
      MenuItem,
      ItemAction,
      Text,
      IconDelete,
    },
  }) => {
    await render(
      <ContextMenuTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <ContextMenu>
          <MenuItem>
            <Text>Shown on hover and focus</Text>
            <ItemAction aria-label="Delete">
              <IconDelete />
            </ItemAction>
          </MenuItem>
          <MenuItem>
            <Text>Hidden</Text>
            <ItemAction aria-label="Delete">
              <IconDelete />
            </ItemAction>
          </MenuItem>
          <MenuItem>
            <Text>Always visible</Text>
            <ItemAction visibility="always" aria-label="Delete">
              <IconDelete />
            </ItemAction>
          </MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>,
    );

    await page.getByTestId("trigger").click();
    await userEvent.keyboard("{ArrowDown}");
    await testScreenshot("ContextMenu item actions - item focused");

    await userEvent.keyboard("{ArrowRight}");
    await testScreenshot("ContextMenu item actions - action focused");
  },
);
