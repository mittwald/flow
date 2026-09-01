import {
  Button,
  FieldError,
  FileField,
  Label,
} from "@mittwald/flow-react-components";

<FileField isInvalid>
  <Label>Zertifikat</Label>
  <Button variant="outline" color="secondary">
    Auswählen
  </Button>
  <FieldError>
    Wir konnten das Zertifikat nicht hochladen. Bitte
    verwende eine .txt-Datei.
  </FieldError>
</FileField>;
