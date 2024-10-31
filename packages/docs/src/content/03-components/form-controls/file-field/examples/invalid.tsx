import Label from "@mittwald/flow-react-components/Label";
import { FileField } from "@mittwald/flow-react-components/FileField";
import { Button } from "@mittwald/flow-react-components/Button";
import { FieldError } from "@mittwald/flow-react-components/FieldError";

<FileField isInvalid>
  <Label>Zertifikat</Label>
  <Button variant="outline" color="secondary">
    Auswählen
  </Button>
  <FieldError>Die Datei ist zu groß</FieldError>
</FileField>;
