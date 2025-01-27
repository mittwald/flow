import { Section } from "@mittwald/flow-react-components/Section";
import { FileDropZone } from "@mittwald/flow-react-components/FileDropZone";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { FileField } from "@mittwald/flow-react-components/FileField";
import { Button } from "@mittwald/flow-react-components/Button";
import { IconImage } from "@mittwald/flow-react-components/Icons";
import { Text } from "@mittwald/flow-react-components/Text";

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
