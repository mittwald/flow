import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

/*
 * Anchored by id, not by ref — which is the only anchor that survives the
 * remote boundary, and the reason this scenario can run in both environments.
 * Both share one reference image, so a coach mark that fails to find its anchor
 * on the host renders somewhere else and the comparison says so.
 *
 * Its chrome is the popover's, but it is positioned by Flow rather than by
 * react-aria's `usePopover`, so placement, tip and entry animation come from a
 * different path here and are what this guards.
 */
test.each(testEnvironments)(
  "CoachMark (%s)",
  async ({
    testScreenshot,
    render,
    components: { Action, Button, CoachMark, Heading, Text },
  }) => {
    await render(
      <>
        <Button id="coach-mark-anchor">Assign a rank</Button>
        <CoachMark anchor="coach-mark-anchor" isDefaultOpen>
          <Heading>New: assign a rank</Heading>
          <Text>
            You can now assign a rank right here, without going through the
            squadron overview.
          </Text>
          <Action closeOverlay="CoachMark">
            <Button>Got it</Button>
          </Action>
        </CoachMark>
      </>,
    );

    await testScreenshot("CoachMark");
  },
);

/*
 * A width past `--coach-mark--max-width` (360px), which caps the content of a
 * coach mark nobody sized. The cap used to survive the width and leave empty
 * background beside the content — so what this guards is that the box and the
 * text inside it end at the same edge.
 */
test.each(testEnvironments)(
  "CoachMark with a width (%s)",
  async ({
    testScreenshot,
    render,
    components: { Action, Button, CoachMark, Heading, Text },
  }) => {
    await render(
      <>
        <Button id="coach-mark-width-anchor">Assign a rank</Button>
        <CoachMark anchor="coach-mark-width-anchor" isDefaultOpen width={500}>
          <Heading>New: assign a rank</Heading>
          <Text>
            You can now assign a rank right here, without going through the
            squadron overview.
          </Text>
          <Action closeOverlay="CoachMark">
            <Button>Got it</Button>
          </Action>
        </CoachMark>
      </>,
    );

    await testScreenshot("CoachMark with a width");
  },
);

/*
 * The collision from #3232, with both sides as they actually occur: a hint
 * anchored in a page header, and the card with the tab bar that sits below it.
 * The card's tab bar is positioned, so before the coach mark claimed a stacking
 * level of its own it painted over the hint's lower half — visible as a strip
 * of tab bar across it, and only in this arrangement.
 */
test.each(testEnvironments)(
  "CoachMark over a positioned sibling (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Button,
      CoachMark,
      Heading,
      LayoutCard,
      Link,
      TabNavigation,
      Text,
    },
  }) => {
    await render(
      <>
        <Button id="coach-mark-stacking-anchor">Assign a rank</Button>
        <CoachMark anchor="coach-mark-stacking-anchor" isDefaultOpen>
          <Heading>New: assign a rank</Heading>
          <Text>
            You can now assign a rank right here, without going through the
            squadron overview.
          </Text>
        </CoachMark>
        <LayoutCard>
          <TabNavigation aria-label="Tab navigation">
            <Link href="#" aria-current="page">
              Squadron
            </Link>
            <Link href="#">Pilots</Link>
            <Link href="#">Starfighters</Link>
            <Link href="#">Missions</Link>
          </TabNavigation>
        </LayoutCard>
      </>,
    );

    await testScreenshot("CoachMark over a positioned sibling");
  },
);
