import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Label,
  NumberField,
  Text,
} from "@mittwald/flow-react-components";

<NumberField minValue={0} maxValue={100}>
  <Label>
    Alter
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
</NumberField>;
