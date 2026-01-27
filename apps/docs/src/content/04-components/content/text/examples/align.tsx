import {
  Align,
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  CopyButton,
  IconDomain,
  Text,
} from "@mittwald/flow-react-components";

<Column>
  <Align>
    <IconDomain />
    <Text>mail.agenturserver.de</Text>
  </Align>

  <Align>
    <Text>mail.agenturserver.de</Text>
    <CopyButton text="mail.agenturserver.de" />
  </Align>

  <Align>
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
  </Align>
</Column>;
