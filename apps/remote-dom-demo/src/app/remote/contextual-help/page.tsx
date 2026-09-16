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
    </Section>
  );
}
