import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
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
        <Text>
          Hier gibt es weitere Informationen, die zu lang
          für die FieldDescription sind.
        </Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  </Label>
</TextArea>;
