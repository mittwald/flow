import {
  prepareForScreenshot,
  testEnvironments,
} from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

/*
 * The keyboard focus ring has to survive the screenshot preamble in both
 * environments — the regression behind the `List items` and `List date range
 * filter` diffs in #2981.
 *
 * `prepareForScreenshot` parks the pointer, and `hover()` emits a
 * `pointermove`. react-aria takes any pointer event as the current interaction
 * modality, but only `pointerdown`/`mousedown` notify its subscribers: nothing
 * re-renders, so elements already carrying `data-focus-visible` keep it. Any
 * render landing *after* that point recomputes `isFocusVisible()` against the
 * now-`pointer` modality and drops the attribute.
 *
 * `Remote` walks into that on keyboard interactions, because it applies the
 * resulting state a thread round trip late. `Local` renders synchronously,
 * before the pointer ever moves, and never noticed. Both share one reference
 * screenshot, so the divergence surfaced as a ~1% pixel diff in the one browser
 * that renders the dark theme — a lot of indirection for "the focus ring is
 * gone".
 *
 * Asserted on the DOM here so it fails in the required browser job with a
 * message that names the cause, rather than only under the opt-in
 * `run-visual-tests` label.
 *
 * The list is the `List items` scenario, verbatim in the parts that matter. Its
 * size is not incidental: the round trip has to outlast the pointer park for the
 * bug to show at all, and a two-column list settles too fast to catch it.
 */

const firstFilterValue = () =>
  page.getByRole("menuitemcheckbox").first().element();

test.each(testEnvironments)(
  "a keyboard-toggled filter value keeps its focus ring at capture time (%s)",
  async ({
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
        status: string;
      }>();

      return (
        <List.List
          aria-label="list"
          getItemId={(i) => i.id}
          selectedKeys={["2"]}
          selectionMode="multiple"
        >
          <ActionGroup>
            <Button>Button</Button>
          </ActionGroup>
          <List.StaticData
            data={[
              {
                id: "1",
                name: "Luke Skywalker",
                role: "Jedi Master",
                status: "active",
              },
              {
                id: "2",
                name: "Leia Organa",
                role: "Rebel Pilot",
                status: "unavailable",
              },
            ]}
          />
          <List.Filter property="role" name="Role" />
          <List.Filter property="status" name="Status" priority="secondary" />
          <List.Search />
          <List.Sorting
            property="name"
            name="Alphabetical"
            defaultEnabled
            directionName="ascending"
          />
          <List.Sorting
            property="name"
            name="Alphabetical"
            direction="desc"
            directionName="descending"
          />
          <List.Item textValue={(i) => i.name}>
            {(i) => (
              <ListItemView>
                <Avatar>
                  <Initials>{i.name}</Initials>
                </Avatar>
                <Heading>
                  {i.name}
                  {i.status === "active" && <Badge>Active</Badge>}
                </Heading>
                <Text>{i.role}</Text>
                <Content>Content</Content>
                <Content slot="bottom">Bottomcontent</Content>
                <ContextMenu>
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

    // Sorting menu, then tab on to the "Role" filter and toggle its first value.
    await page.getByRole("button", { name: "Alphabetical" }).click();
    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{enter}");
    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{enter}");
    await userEvent.keyboard("{enter}");

    await prepareForScreenshot();

    /*
     * `data-selected` first: without it the toggle never round-tripped, and the
     * focus assertion below would be vacuous rather than wrong.
     */
    await expect
      .poll(() => firstFilterValue().getAttribute("data-selected"), {
        message:
          "The filter value never became selected, so the keyboard toggle did not reach the list at all.",
      })
      .toBe("true");

    expect(
      firstFilterValue().hasAttribute("data-focus-visible"),
      "The keyboard-focused filter value lost `data-focus-visible`, so its focus ring is missing from the screenshot. A render landed after the pointer was parked — see the comment at the top of this file.",
    ).toBe(true);
  },
);
