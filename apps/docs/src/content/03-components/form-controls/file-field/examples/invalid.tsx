import { Label } from "@mittwald/flow-react-components";
import { FileField } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { FieldError } from "@mittwald/flow-react-components";

<FileField isInvalid>
  <Label>Zertifikat</Label>
  <Button variant="outline" color="secondary">
    Auswählen
  </Button>
  <FieldError>Die Datei ist zu groß</FieldError>
</FileField>;
