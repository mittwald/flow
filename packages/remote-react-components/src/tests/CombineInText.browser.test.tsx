import { testEnvironments } from "@/tests/lib/environments";
import { assert, expect, test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "a Combine inside a Text stays in the line (%s)",
  async ({
    render,
    components: {
      typedList,
      ListItemView,
      Heading,
      Text,
      Combine,
      Button,
      ContextualHelp,
      ContextualHelpTrigger,
    },
  }) => {
    function Wrapper() {
      const List = typedList<{ id: string; name: string }>();

      return (
        <List.List aria-label="list" getItemId={(i) => i.id}>
          <List.StaticData data={[{ id: "1", name: "Millennium Falcon" }]} />
          <List.Item textValue={(i) => i.name}>
            {(i) => (
              <ListItemView>
                <Heading>{i.name}</Heading>
                <Text data-testid="runtime">PHP 8.2</Text>
                <Text>
                  <Combine>
                    <Text>Deprecated</Text>
                    <ContextualHelpTrigger>
                      <Button data-testid="trigger" />
                      <ContextualHelp>
                        <Text>Update the runtime.</Text>
                      </ContextualHelp>
                    </ContextualHelpTrigger>
                  </Combine>
                </Text>
                <Text data-testid="deploy">Last deploy 2 days ago</Text>
              </ListItemView>
            )}
          </List.Item>
        </List.List>
      );
    }

    await render(<Wrapper />);

    const runtime = page.getByTestId("runtime");
    const deploy = page.getByTestId("deploy");
    const trigger = page.getByTestId("trigger");

    // `Remote` materialises the host tree a round trip after `render()`.
    await expect.element(runtime).toBeInTheDocument();

    const combine = trigger.element().closest(".flow--combine");
    assert(combine !== null, "the Combine is rendered");
    expect(getComputedStyle(combine).display).toBe("inline-flex");

    const subTitle = runtime.element().parentElement;
    assert(subTitle !== null, "the subtitle line is rendered");
    const tops = Array.from(subTitle.children).map(
      (entry) => entry.getBoundingClientRect().top,
    );
    expect(new Set(tops).size).toBe(1);

    expect(deploy.element().getBoundingClientRect().left).toBeGreaterThan(
      combine.getBoundingClientRect().right,
    );

    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
  },
);
