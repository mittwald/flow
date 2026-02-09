import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  Label,
  Text,
  TextField,
} from "@mittwald/flow-react-components";

<TextField>
  <Label>
    URL
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
</TextField>;
