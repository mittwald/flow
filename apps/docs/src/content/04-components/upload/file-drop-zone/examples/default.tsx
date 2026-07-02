import {
  Button,
  FileDropZone,
  FileField,
  Heading,
  IconUpload,
  Section,
} from "@mittwald/flow-react-components";

<Section>
  <FileDropZone onChange={(files) => console.log(files)}>
    <IconUpload />
    <Heading>Datei ablegen</Heading>
    <FileField>
      <Button>Datei auswählen</Button>
    </FileField>
  </FileDropZone>
</Section>;
