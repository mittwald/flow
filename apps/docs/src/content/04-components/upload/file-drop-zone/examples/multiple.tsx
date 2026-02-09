import {
  Button,
  FileDropZone,
  FileField,
  Heading,
  IconUpload,
  Section,
} from "@mittwald/flow-react-components";

<Section>
  <FileDropZone
    multiple
    onChange={(files) => console.log(files)}
  >
    <IconUpload />
    <Heading>Dateien ablegen</Heading>
    <FileField
      name="file"
      onChange={(files) => console.log(files)}
    >
      <Button>Dateien auswählen</Button>
    </FileField>
  </FileDropZone>
</Section>;
