import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Label,
  TimeField,
  Text,
} from "@mittwald/flow-react-components";

<TimeField>
  <Label>
    Uhrzeit
    <ContextualHelpTrigger subject="Uhrzeit">
      <Button />
      <ContextualHelp>
        <Text>
          Hier gibt es weitere Informationen, die zu lang
          für die FieldDescription sind.
        </Text>
      </ContextualHelp>
    </ContextualHelpTrigger>
  </Label>
</TimeField>;
