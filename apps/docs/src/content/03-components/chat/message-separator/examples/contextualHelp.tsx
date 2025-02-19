import {
  Align,
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  MessageSeparator,
  Text,
} from "@mittwald/flow-react-components";

<MessageSeparator>
  <Align>
    <Text>Ticket erstellt</Text>
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp>
        Ticket erstellt von Max Mustermann am 12.2.2025, um
        12:43 Uhr
      </ContextualHelp>
    </ContextualHelpTrigger>
  </Align>
</MessageSeparator>;
