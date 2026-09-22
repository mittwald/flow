import {
  Action,
  Button,
  CoachMark,
  Heading,
  Section,
  Text,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { useRef } from "react";

export default () => {
  const anchor = useRef<HTMLButtonElement>(null);
  const controller = useOverlayController("CoachMark", {
    isDefaultOpen: true,
  });

  return (
    <Section style={{ paddingBlockEnd: 200 }}>
      <Button
        ref={anchor}
        onPress={() => controller.open()}
      >
        Domain verbinden
      </Button>

      {/* Pinned downwards so the hint stays inside this example's frame. */}
      <CoachMark
        shouldFlip={false}
        anchorRef={anchor}
        controller={controller}
      >
        <Heading>Neu: Domain verbinden</Heading>
        <Text>
          Du kannst deine Domain jetzt direkt hier verbinden
          – ohne den Umweg über die Domain-Übersicht.
        </Text>
        <Action closeOverlay="CoachMark">
          <Button>Verstanden</Button>
        </Action>
      </CoachMark>
    </Section>
  );
};
