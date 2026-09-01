import {
  Combine,
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  CopyButton,
  IconDomain,
  Text,
} from "@mittwald/flow-react-components";

<>
  <Combine>
    <IconDomain />
    <Text>mail.agenturserver.de</Text>
  </Combine>

  <Combine>
    <Text>mail.agenturserver.de</Text>
    <CopyButton text="mail.agenturserver.de" />
  </Combine>

  <Combine>
    <Text>mail.agenturserver.de</Text>
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp>
        <Text>
          Hier wird die URL des Servers angezeigt, der für
          den E-Mail-Versand genutzt wird.
        </Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  </Combine>
</>;
