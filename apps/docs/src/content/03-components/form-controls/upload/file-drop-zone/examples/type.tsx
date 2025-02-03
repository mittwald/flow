import { Section } from "@mittwald/flow-react-components";
import { FileDropZone } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { FileField } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { IconImage } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";

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
    <FileField
      name="file"
      onChange={(files) => console.log(files)}
    >
      <Button>Bild auswählen</Button>
    </FileField>
  </FileDropZone>
</Section>;
