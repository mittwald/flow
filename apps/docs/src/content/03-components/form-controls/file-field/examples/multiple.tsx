import {
  Button,
  FileField,
  Label,
  Section,
  LabeledValue,
  Text,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [files, setFiles] = useState<FileList | null>(null);

  return (
    <Section>
      <FileField multiple onChange={setFiles}>
        <Label>Dateien</Label>
        <Button variant="outline" color="secondary">
          Auswählen
        </Button>
      </FileField>

      <LabeledValue>
        <Label>Ausgewählte Dateien</Label>
        <Text>
          {files
            ? [...files].map((file) => file.name).join(", ")
            : "-"}
        </Text>
      </LabeledValue>
    </Section>
  );
};
