import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { useRef } from "react";
import {
  Button,
  CoachMark,
  Heading,
  Text,
} from "@mittwald/flow-react-components";
import { useOverlayController } from "@mittwald/flow-react-components";

/*
 * Local only: a coach mark anchors through a ref, and a ref does not cross the
 * remote boundary — so it is not remote-capable and there is no Remote variant
 * to compare against.
 *
 * Its chrome is the popover's, but it is positioned by Flow rather than by
 * react-aria's `usePopover`, so placement, tip and entry animation come from a
 * different path here and are what this guards.
 */
const [localEnvironment] = testEnvironments;

const Spotlight = () => {
  const anchor = useRef<HTMLButtonElement>(null);
  const controller = useOverlayController("CoachMark", {
    isDefaultOpen: true,
  });

  return (
    <>
      <Button ref={anchor} onPress={() => controller.open()}>
        Assign a rank
      </Button>
      <CoachMark anchorRef={anchor} controller={controller}>
        <Heading>New: assign a rank</Heading>
        <Text>
          You can now assign a rank right here, without going through the
          squadron overview.
        </Text>
      </CoachMark>
    </>
  );
};

test(`CoachMark (${localEnvironment})`, async () => {
  await localEnvironment.render(<Spotlight />);
  await localEnvironment.testScreenshot("CoachMark");
});
