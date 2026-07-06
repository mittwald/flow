import {
  Button,
  Checkbox,
  CheckboxGroup,
  ContextualHelp,
  ContextualHelpTrigger,
  Label,
  Text,
} from "@mittwald/flow-react-components";

<CheckboxGroup>
  <Label>
    Berechtigungen
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
  <Checkbox value="read">Lesen</Checkbox>
  <Checkbox value="write">Schreiben</Checkbox>
</CheckboxGroup>;
