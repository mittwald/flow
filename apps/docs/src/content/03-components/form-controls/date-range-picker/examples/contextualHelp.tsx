import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  DateRangePicker,
  Heading,
  Label,
  Text,
} from "@mittwald/flow-react-components";

<DateRangePicker>
  <Label>
    Zeitraum
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
</DateRangePicker>;
