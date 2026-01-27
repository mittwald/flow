import {
  Button,
  ComboBox,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  Label,
  Option,
  Text,
} from "@mittwald/flow-react-components";

<ComboBox>
  <Label>
    Domain
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
  <Option>mydomain.de</Option>
  <Option>shop.mydomain.de</Option>
  <Option>anotherdomain.com</Option>
  <Option>www.anotherdomain.com</Option>
  <Option>anotherdomain.com/shop</Option>
  <Option>anotherdomain.com/blog</Option>
  <Option>onemoredomain.de</Option>
  <Option>www.onemoredomain.de</Option>
</ComboBox>;
