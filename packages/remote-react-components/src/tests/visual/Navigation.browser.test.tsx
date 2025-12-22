import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Navigation (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Navigation,
      Link,
      IconStar,
      Text,
      NavigationGroup,
      Label,
      Badge,
      CounterBadge,
    },
  }) => {
    await render(
      <Navigation>
        <Link>
          <IconStar />
          <Text>Link</Text>
        </Link>
        <Link>
          <IconStar />
          <Text>Link</Text>
        </Link>
        <NavigationGroup>
          <Label>NavigationGroup</Label>
          <Link>
            Link<Badge>Badge</Badge>
          </Link>
          <Link>
            Link
            <CounterBadge count={2} />
          </Link>
        </NavigationGroup>
        <NavigationGroup collapsable>
          <Label data-testid="trigger">Collapsable</Label>
          <Link>Link</Link>
          <Link>Link</Link>
        </NavigationGroup>
      </Navigation>,
    );

    await testScreenshot("Navigation - default");

    const trigger = page.getByTestId("trigger");
    await trigger.click();

    await testScreenshot("Navigation - collapsed");
  },
);
