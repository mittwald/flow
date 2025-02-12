import { Align } from "@mittwald/flow-react-components/Align";
import { Text } from "@mittwald/flow-react-components/Text";
import { Button } from "@mittwald/flow-react-components/Button";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@mittwald/flow-react-components/ContextualHelp";

<Align>
  <Text>mail.agenturserver.de</Text>

  <ContextualHelpTrigger>
    <Button />

    <ContextualHelp>
      <Text>
        Hier wird die URL des Servers angezeigt, der für den
        E-Mail-Versand genutzt wird.
      </Text>
    </ContextualHelp>
  </ContextualHelpTrigger>
</Align>;
