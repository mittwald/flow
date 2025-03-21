import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  Label,
  TimeField,
  Text,
} from "@mittwald/flow-react-components";

<TimeField>
  <Label>
    Uhrzeit
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
</TimeField>;
