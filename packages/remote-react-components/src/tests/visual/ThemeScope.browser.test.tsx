import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { isDarkVisualTheme } from "@/tests/lib/visualTheme";
import { test } from "vitest";
import { page } from "vitest/browser";

const themeScopeSince = "1.6.0-next.68";

type Theme = "light" | "dark" | "system";

/*
 * The page theme comes from the browser (webkit light, firefox dark), so the
 * scopes are set against it. The open ContextMenu sits in an accent box of the
 * opposite theme inside a card of the page theme: a menu that falls back to
 * the page or takes the outer scope shows the wrong colors in both browsers.
 * The open Tooltip and the Modal do the same from a card of the opposite
 * theme. `system` follows playwright's emulated light preference.
 */
const pageTheme = isDarkVisualTheme() ? "dark" : "light";
const otherTheme = pageTheme === "dark" ? "light" : "dark";

const scopes: { card: Theme; accentBox: Theme; withTooltip?: boolean }[] = [
  { card: pageTheme, accentBox: otherTheme },
  { card: otherTheme, accentBox: pageTheme, withTooltip: true },
  { card: "system", accentBox: "dark" },
];

const requests = [
  { day: "Mon", requests: 1200 },
  { day: "Tue", requests: 1900 },
  { day: "Wed", requests: 1500 },
  { day: "Thu", requests: 2400 },
];

test.skipIf(crossVersion({ below: themeScopeSince })).each(testEnvironments)(
  "ThemeScope (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ThemeScope,
      ColumnLayout,
      LayoutCard,
      AccentBox,
      Section,
      Heading,
      Text,
      Button,
      CartesianChart,
      Area,
      XAxis,
      YAxis,
      ContextMenuTrigger,
      ContextMenu,
      MenuItem,
      LoadingSpinner,
      TooltipTrigger,
      Tooltip,
    },
  }) => {
    await render(
      <ColumnLayout m={[1, 1, 1]} l={[1, 1, 1]} columnGap="xl">
        {scopes.map(({ card, accentBox, withTooltip }, index) => (
          <ThemeScope theme={card} key={card}>
            <LayoutCard>
              <Section>
                <Heading>Theme {card}</Heading>
                <Text>This card renders in its own theme.</Text>
                {withTooltip && (
                  <TooltipTrigger isOpen>
                    <Button variant="soft" color="secondary">
                      Tooltip
                    </Button>
                    <Tooltip>Tooltip</Tooltip>
                  </TooltipTrigger>
                )}
                <CartesianChart data={requests} height="80px">
                  <Area dataKey="requests" />
                  <XAxis dataKey="day" />
                  <YAxis />
                </CartesianChart>
                <ThemeScope theme={accentBox}>
                  <AccentBox>
                    <Section>
                      <Heading level={3}>Nested theme {accentBox}</Heading>
                      <ContextMenuTrigger>
                        <Button
                          data-testid={index === 0 ? "trigger" : undefined}
                        >
                          Button
                        </Button>
                        <ContextMenu>
                          <MenuItem>Edit</MenuItem>
                          <MenuItem>Delete</MenuItem>
                        </ContextMenu>
                      </ContextMenuTrigger>
                      <LoadingSpinner />
                    </Section>
                  </AccentBox>
                </ThemeScope>
              </Section>
            </LayoutCard>
          </ThemeScope>
        ))}
      </ColumnLayout>,
    );

    await page.getByTestId("trigger").click();

    await testScreenshot("ThemeScope");
  },
);

test.skipIf(crossVersion({ below: themeScopeSince })).each(testEnvironments)(
  "ThemeScope modal (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ThemeScope,
      ModalTrigger,
      Modal,
      Button,
      Heading,
      Content,
      Text,
      TextField,
      Label,
    },
  }) => {
    await render(
      <ThemeScope theme={otherTheme}>
        <ModalTrigger>
          <Button data-testid="trigger">Modal</Button>
          <Modal>
            <Heading>Theme {otherTheme}</Heading>
            <Content>
              <Text>This modal renders in the theme of its scope.</Text>
              <TextField>
                <Label>Name</Label>
              </TextField>
            </Content>
          </Modal>
        </ModalTrigger>
      </ThemeScope>,
    );

    await page.getByTestId("trigger").click();

    await testScreenshot("ThemeScope - modal");
  },
);
