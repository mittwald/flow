import {
  Button,
  ContextualHelp,
  ContextualHelpTrigger,
  FileField,
  Label,
  Text,
} from "@mittwald/flow-react-components";

<FileField>
  <Label>
    Zertifikat
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
  <Button variant="outline" color="secondary">
    Auswählen
  </Button>
</FileField>;
