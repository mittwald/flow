import { Section } from "@mittwald/flow-react-components";
import { FileDropZone } from "@mittwald/flow-react-components";
import { IconUpload } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { FileField } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";

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
