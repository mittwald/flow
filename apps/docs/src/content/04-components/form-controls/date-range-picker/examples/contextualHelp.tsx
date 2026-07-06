import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  DateRangePicker,
  Label,
  Text,
} from "@mittwald/flow-react-components";

<DateRangePicker>
  <Label>
    Zeitraum
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
</DateRangePicker>;
