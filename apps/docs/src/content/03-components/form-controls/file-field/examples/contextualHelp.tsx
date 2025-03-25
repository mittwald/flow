import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  FileField,
  Heading,
  Label,
  Text,
} from "@mittwald/flow-react-components";

<FileField>
  <Label>
    Zertifikat
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
  <Button variant="outline" color="secondary">
    Auswählen
  </Button>
</FileField>;
