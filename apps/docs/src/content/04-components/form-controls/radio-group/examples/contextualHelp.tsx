import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  Label,
  Radio,
  RadioGroup,
  Text,
} from "@mittwald/flow-react-components";

<RadioGroup defaultValue="more">
  <Label>
    Täglicher Kaffeekonsum
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
  <Radio value="more">Mehr als 6 Tassen</Radio>
  <Radio value="5-6">5-6 Tassen</Radio>
  <Radio value="3-4">3-4 Tassen</Radio>
  <Radio value="1-2">1-2 Tassen</Radio>
  <Radio value="none">Trinke keinen Kaffee</Radio>
</RadioGroup>;
