"use client";
import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Section>
      <ContextualHelpTrigger subject="the Death Star">
        <Button />
        <ContextualHelp>
          <Heading>Battle station status</Heading>
          <Text>The Death Star is fully operational.</Text>
        </ContextualHelp>
      </ContextualHelpTrigger>

      <ContextualHelpTrigger subject="the shield generator">
        <Button />
        <ContextualHelp modality="non-modal">
          <Heading>Shield generator</Heading>
          <Text>
            This hint leaves the page scrollable and survives scrolling. It is
            plain content, not a dialog.
          </Text>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Section>
  );
}
