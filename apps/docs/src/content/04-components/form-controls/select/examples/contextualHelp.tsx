import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  Label,
  Option,
  Select,
  Text,
} from "@mittwald/flow-react-components";

<Select>
  <Label>
    App
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
  <Option>WordPress</Option>
  <Option>TYPO3</Option>
  <Option>Contao</Option>
  <Option>Drupal</Option>
  <Option>Joomla!</Option>
  <Option>Matomo</Option>
</Select>;
