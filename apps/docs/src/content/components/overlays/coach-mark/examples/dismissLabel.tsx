import {
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
        Backup erstellen
      </Button>

      {/* Pinned downwards so the hint stays inside this example's frame. */}
      <CoachMark
        shouldFlip={false}
        anchorRef={anchor}
        controller={controller}
        dismissLabel="Ausprobieren"
      >
        <Heading>Neu: Backups planen</Heading>
        <Text>
          Lege fest, wann ein Backup automatisch erstellt
          wird.
        </Text>
      </CoachMark>
    </Section>
  );
};
