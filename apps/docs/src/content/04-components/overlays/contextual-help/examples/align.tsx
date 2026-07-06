import {
  Align,
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Text,
} from "@mittwald/flow-react-components";

<Align>
  <Text>mail.agenturserver.de</Text>

  <ContextualHelpTrigger label="mail.agenturserver.de">
    <Button />

    <ContextualHelp>
      <Text>
        Hier wird die URL des Servers angezeigt, der für den
        E-Mail-Versand genutzt wird.
      </Text>
    </ContextualHelp>
  </ContextualHelpTrigger>
</Align>;
