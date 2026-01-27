import {
  Button,
  FieldDescription,
  FileField,
  Label,
} from "@mittwald/flow-react-components";

<FileField accept={"image/png, image/jpeg"}>
  <Label>Zertifikat</Label>
  <Button variant="outline" color="secondary">
    Auswählen
  </Button>
  <FieldDescription>
    Erlaubte Dateitypen sind .jpeg und .png
  </FieldDescription>
</FileField>;
