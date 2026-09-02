import {
  Button,
  FileDropZone,
  FileField,
  Heading,
  IconImage,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<Section>
  <FileDropZone
    accept="image/png"
    onChange={(files) => console.log(files)}
  >
    <IconImage />
    <Heading>Bild ablegen</Heading>
    <Text>
      Es sind nur Bilder vom Typ image/png erlaubt.
    </Text>
    <FileField>
      <Button>Bild auswählen</Button>
    </FileField>
  </FileDropZone>
</Section>;
