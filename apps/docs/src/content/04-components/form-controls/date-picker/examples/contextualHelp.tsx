import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  DatePicker,
  Text,
  Label,
} from "@mittwald/flow-react-components";

<DatePicker>
  <Label>
    Datum
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
</DatePicker>;
