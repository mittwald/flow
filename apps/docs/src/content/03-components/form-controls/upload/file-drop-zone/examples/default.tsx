import { Section } from "@mittwald/flow-react-components";
import { FileDropZone } from "@mittwald/flow-react-components";
import { IconUpload } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { FileField } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";

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
