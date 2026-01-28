import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "ContextMenu (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ContextMenu,
      ContextMenuTrigger,
      Button,
      ContextMenuSection,
      Heading,
      MenuItem,
      Separator,
      IconStar,
      Text,
      Avatar,
      Initials,
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
            <MenuItem href="#">
              <IconStar />
              <Text>Link 1</Text>
            </MenuItem>
            <MenuItem href="#">Link 2</MenuItem>
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

    const trigger = page.getByTestId("trigger");

    await trigger.click();

    await testScreenshot("ContextMenu - opened");
  },
);
