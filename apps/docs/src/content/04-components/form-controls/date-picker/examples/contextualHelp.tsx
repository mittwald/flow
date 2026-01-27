import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  DatePicker,
  Heading,
  Text,
  Label,
} from "@mittwald/flow-react-components";

<DatePicker>
  <Label>
    Datum
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
</DatePicker>;
