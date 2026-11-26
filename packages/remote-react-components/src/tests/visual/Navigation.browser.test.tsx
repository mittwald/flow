import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

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
      AlertBadge,
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
          <Link>
            Link<AlertBadge>AlertBadge</AlertBadge>
          </Link>
          <Link>Link</Link>
        </NavigationGroup>
        <NavigationGroup collapsable defaultExpanded={false}>
          <Label>Collapsed</Label>
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

test.each(testEnvironments)(
  "Navigation in a narrow container (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ColumnLayout,
      Navigation,
      Link,
      AlertBadge,
      Badge,
      IconStar,
      Text,
      Truncate,
    },
  }) => {
    await render(
      <ColumnLayout m={[1, 1, 1, 1, 1, 1]}>
        <Navigation>
          <Link>
            Galactic Empire of the Outer Rim
            <AlertBadge status="warning">Deprecated</AlertBadge>
          </Link>
          <Link>
            <IconStar />
            <Text>Rebel Alliance High Command</Text>
            <Badge>Neu</Badge>
          </Link>
          <Link>
            <IconStar />
            <Truncate>Mandalorian Covert of Nevarro</Truncate>
          </Link>
        </Navigation>
      </ColumnLayout>,
    );

    await testScreenshot("Navigation - narrow container");
  },
);

// Navigation renders an ItemAction from 1.8.0-next.2.
test.skipIf(crossVersion({ below: "1.8.0-next.2" })).each(testEnvironments)(
  "Navigation with item actions (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Navigation,
      NavigationGroup,
      ItemAction,
      Link,
      Label,
      Text,
      IconStar,
      IconStarFilled,
      CounterBadge,
    },
  }) => {
    await render(
      <Navigation>
        <Link href="#">
          <IconStar />
          <Text>Shown on focus</Text>
          <ItemAction aria-label="Pin">
            <IconStar />
          </ItemAction>
        </Link>
        <Link href="#">
          <IconStar />
          <Text>Hidden</Text>
          <ItemAction aria-label="Pin">
            <IconStar />
          </ItemAction>
        </Link>
        <NavigationGroup>
          <Label>NavigationGroup</Label>
          <Link href="#" aria-current="page">
            <Text>Current, always visible</Text>
            <CounterBadge count={2} />
            <ItemAction visibility="always" aria-label="Unpin">
              <IconStarFilled />
            </ItemAction>
          </Link>
          <Link href="#">
            <Text>Galactic Empire of the Outer Rim</Text>
            <ItemAction visibility="always" aria-label="Unpin">
              <IconStarFilled />
            </ItemAction>
          </Link>
        </NavigationGroup>
      </Navigation>,
    );

    await userEvent.tab();
    await testScreenshot("Navigation item actions - link focused");

    await userEvent.tab();
    await testScreenshot("Navigation item actions - action focused");
  },
);
