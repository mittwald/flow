import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { sleep } from "@/tests/lib/sleep";

test.each(testEnvironments)(
  "List items (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      typedList,
      ActionGroup,
      Button,
      ListItemView,
      Avatar,
      Initials,
      Heading,
      Badge,
      ContextMenu,
      MenuItem,
      Text,
      Content,
    },
  }) => {
    function Wrapper() {
      const List = typedList<{
        id: string;
        name: string;
        role: string;
        active: boolean;
      }>();

      return (
        <List.List aria-label="list" getItemId={(i) => i.id}>
          <ActionGroup>
            <Button>Button</Button>
          </ActionGroup>
          <List.StaticData
            data={[
              { id: "1", name: "Max Mustermann", role: "Admin", active: true },
              { id: "2", name: "John Doe", role: "Developer", active: false },
            ]}
          />
          <List.Filter property="role" name="Role" />
          <List.Search data-testid="search" />
          <List.Sorting property="name" name="A-Z" defaultEnabled />
          <List.Sorting property="name" name="Z-A" direction="desc" />
          <List.Item textValue={(i) => i.name}>
            {(i) => (
              <ListItemView>
                <Avatar>
                  <Initials>{i.name}</Initials>
                </Avatar>
                <Heading>
                  {i.name}
                  {i.active && <Badge>Active</Badge>}
                </Heading>
                <Text>{i.role}</Text>
                <Content>Content</Content>
                <Content slot="bottom" data-testid="bottomContent">
                  Bottomcontent
                </Content>
                <ContextMenu data-testid="contextMenu">
                  <MenuItem>Show details</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </ContextMenu>
              </ListItemView>
            )}
          </List.Item>
        </List.List>
      );
    }

    await render(<Wrapper />);

    const search = page.getByTestId("search");
    const bottomContent = page.getByTestId("bottomContent");
    const sorting = page.getByRole("button", { name: "A-Z" });
    const filter = page.getByRole("button", { name: "Role" });
    const contextMenu = page.getByLocator('[aria-label="Options"]');

    await testScreenshot("List items - default");

    await sorting.click();
    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{enter}");

    await testScreenshot("List items - sorted");

    await filter.click();
    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{enter}");

    await testScreenshot("List items - filtered");

    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{enter}");
    await userEvent.keyboard("{escape}");
    await search.click();
    await userEvent.keyboard("Max");
    await sleep(1000);

    await testScreenshot("List items - searched");

    await userEvent.dblClick(bottomContent);
    await testScreenshot("List items - Bottom content text selected");

    await contextMenu.click();
    await testScreenshot("List items - ContextMenu opened");
  },
);

test.each(testEnvironments)(
  "List tiles (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      typedList,
      ListItemView,
      Avatar,
      Initials,
      Heading,
      Badge,
      ContextMenu,
      MenuItem,
      Text,
      Content,
    },
  }) => {
    function Wrapper() {
      const List = typedList<{
        id: string;
        name: string;
        role: string;
        active: boolean;
      }>();

      return (
        <List.List
          defaultViewMode="tiles"
          aria-label="list"
          getItemId={(i) => i.id}
        >
          <List.StaticData
            data={[
              { id: "1", name: "Max Mustermann", role: "Admin", active: true },
              { id: "2", name: "John Doe", role: "Developer", active: false },
            ]}
          />
          <List.Item showTiles textValue={(i) => i.name}>
            {(i) => (
              <ListItemView>
                <Avatar>
                  <Initials>{i.name}</Initials>
                </Avatar>
                <Heading>
                  {i.name}
                  {i.active && <Badge>Active</Badge>}
                </Heading>
                <Text>{i.role}</Text>
                <Content>Content</Content>
                <Content slot="bottom">Bottom content</Content>
                <ContextMenu data-testid="contextMenu">
                  <MenuItem>Show details</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </ContextMenu>
              </ListItemView>
            )}
          </List.Item>
        </List.List>
      );
    }

    await render(<Wrapper />);

    await testScreenshot("List tiles");
  },
);

test.each(testEnvironments)(
  "List table (%s)",
  async ({ testScreenshot, render, components: { typedList } }) => {
    function Wrapper() {
      const List = typedList<{
        id: string;
        name: string;
        role: string;
        active: boolean;
      }>();

      return (
        <List.List
          defaultViewMode="table"
          aria-label="list"
          getItemId={(i) => i.id}
        >
          <List.StaticData
            data={[
              { id: "1", name: "Max Mustermann", role: "Admin", active: true },
              { id: "2", name: "John Doe", role: "Developer", active: false },
            ]}
          />
          <List.Table>
            <List.TableHeader>
              <List.TableColumn>Name</List.TableColumn>
              <List.TableColumn>Role</List.TableColumn>
            </List.TableHeader>
            <List.TableBody>
              <List.TableRow>
                <List.TableCell>{(i) => i.name}</List.TableCell>
                <List.TableCell>{(i) => i.role}</List.TableCell>
              </List.TableRow>
            </List.TableBody>
          </List.Table>
        </List.List>
      );
    }

    await render(<Wrapper />);

    await testScreenshot("List table");
  },
);
