import {
  ImageUpload,
  useImageUploadController,
} from "@mittwald/flow-react-components/ImageUpload";
import { Image } from "@mittwald/flow-react-components/Image";
import { LabeledValue } from "@mittwald/flow-react-components/LabeledValue";
import { Label } from "@mittwald/flow-react-components/Label";
import { Section } from "@mittwald/flow-react-components/Section";

export default () => {
  const controller = useImageUploadController();
  const url = controller.useUrl();

  return (
    <Section>
      <ImageUpload controller={controller} />
      {url && (
        <LabeledValue>
          <Label>Ergebnis</Label>
          <Image
            src={url}
            style={{ width: "contentWidth" }}
          />
        </LabeledValue>
      )}
    </Section>
  );
};
