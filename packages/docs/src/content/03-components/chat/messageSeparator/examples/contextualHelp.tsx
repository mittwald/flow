import { Button } from "@mittwald/flow-react-components/Button";
import { Align } from "@mittwald/flow-react-components/Align";
import { Text } from "@mittwald/flow-react-components/Text";
import { MessageSeparator } from "@mittwald/flow-react-components/MessageSeparator";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@mittwald/flow-react-components/ContextualHelp";

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
