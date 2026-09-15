import {
  Button,
  ContextualHelp,
  Heading,
  Section,
  Text,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { useRef } from "react";

export default () => {
  const anchor = useRef<HTMLButtonElement>(null);
  const controller = useOverlayController(
    "ContextualHelp",
    {
      isDefaultOpen: true,
    },
  );

  const acknowledge = () => controller.close();

  return (
    <>
      <Button
        ref={anchor}
        onPress={() => controller.open()}
      >
        Domain verbinden
      </Button>

      <ContextualHelp
        controller={controller}
        triggerRef={anchor}
        modality="non-modal"
        width={320}
      >
        <Section>
          <Heading>Neu: Domain verbinden</Heading>
          <Text>
            Du kannst deine Domain jetzt direkt hier
            verbinden – ohne den Umweg über die
            Domain-Übersicht.
          </Text>
          <Button size="s" onPress={acknowledge}>
            Verstanden
          </Button>
        </Section>
      </ContextualHelp>
    </>
  );
};
