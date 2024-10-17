import FileDropZone from "@mittwald/flow-react-components/FileDropZone";
import { useFileController } from "@mittwald/flow-react-components/FileTrigger";
import Section from "@mittwald/flow-react-components/Section";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import Text from "@mittwald/flow-react-components/Text";

export default () => {
  const controller = useFileController();
  const files = controller.useFiles();

  return (
    <Section>
      <FileDropZone controller={controller} />
      <LabeledValue>
        <Label>Ausgewählte Datei</Label>
        <Text>
          {files.length > 0
            ? files.map((f) => f.name).join(", ")
            : "-"}
        </Text>
      </LabeledValue>
    </Section>
  );
};
