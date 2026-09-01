import {
  Combine,
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Text,
} from "@mittwald/flow-react-components";

<Combine>
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
</Combine>;
