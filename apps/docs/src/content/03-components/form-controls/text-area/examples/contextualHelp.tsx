import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  Label,
  TextArea,
  Text,
} from "@mittwald/flow-react-components";

<TextArea>
  <Label>
    Public Key
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp>
        <Heading>Weitere Informationen</Heading>
        <Text>
          Hier gibt es weitere Informationen, die zu lang
          für die FieldDescription sind.
        </Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  </Label>
</TextArea>;
