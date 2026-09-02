import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Label,
  Text,
  TextField,
} from "@mittwald/flow-react-components";

<TextField>
  <Label>
    URL
    <ContextualHelpTrigger subject="URL">
      <Button />
      <ContextualHelp>
        <Text>
          Hier gibt es weitere Informationen, die zu lang
          für die FieldDescription sind.
        </Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  </Label>
</TextField>;
