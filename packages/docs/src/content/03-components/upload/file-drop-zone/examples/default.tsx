import { Section } from "@mittwald/flow-react-components/Section";
import { FileDropZone } from "@mittwald/flow-react-components/FileDropZone";
import { IconUpload } from "@mittwald/flow-react-components/Icons";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { FileField } from "@mittwald/flow-react-components/FileField";
import { Button } from "@mittwald/flow-react-components/Button";

<Section>
  <FileDropZone onChange={(files) => console.log(files)}>
    <IconUpload />
    <Heading>Datei ablegen</Heading>
    <FileField
      name="file"
      onChange={(files) => console.log(files)}
    >
      <Button>Datei auswählen</Button>
    </FileField>
  </FileDropZone>
</Section>;
