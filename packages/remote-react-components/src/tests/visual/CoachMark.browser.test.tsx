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
    components: { Button, CoachMark, Heading, Text },
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
        </CoachMark>
      </>,
    );

    await testScreenshot("CoachMark");
  },
);
