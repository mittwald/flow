import {
  Button,
  FileCard,
  FileCardList,
  FileDropZone,
  FileField,
  Heading,
  IconUpload,
  Section,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Section>
      <FileDropZone
        multiple
        onChange={(value) => {
          if (value) {
            setFiles([...files, ...value]);
          }
        }}
      >
        <IconUpload />
        <Heading>Dateien ablegen</Heading>
        <FileField
          name="file"
          onChange={(value) => {
            if (value) {
              setFiles([...files, ...value]);
            }
          }}
        >
          <Button>Dateien auswählen</Button>
        </FileField>
      </FileDropZone>

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
