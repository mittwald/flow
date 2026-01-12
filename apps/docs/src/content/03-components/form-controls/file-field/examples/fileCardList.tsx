import {
  Button,
  FileCard,
  FileCardList,
  FileField,
  Label,
  Section,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Section>
      <FileField
        multiple
        onChange={(value) => {
          if (value) {
            setFiles([...files, ...value]);
          }
        }}
      >
        <Label>Dateien</Label>
        <Button variant="outline" color="secondary">
          Auswählen
        </Button>
      </FileField>

      <FileCardList>
        {files.map((file) => (
          <FileCard
            name={file.name}
            type={file.type}
            key={file.name}
            sizeInBytes={file.size}
            onDelete={() =>
              setFiles(
                files.filter((watched) => watched !== file),
              )
            }
          />
        ))}
      </FileCardList>
    </Section>
  );
};
