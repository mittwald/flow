/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Heading,
  IconDanger,
  IllustratedMessage,
  ImageCropper,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

const workingImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23264cff'/%3E%3Ccircle cx='200' cy='150' r='90' fill='%23ffd400'/%3E%3C/svg%3E";

/** Loads for display, but the canvas read it needs for cropping has no CORS. */
const crossOriginImage =
  "https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg";

const missingImage = "/this-image-does-not-exist.png";

/** The Vue counterpart of `/remote/image-cropper`. */
export const ImageCropperDemo = defineComponent({
  name: "ImageCropperDemo",
  setup() {
    const croppedFile = ref<string>();
    const reportedError = ref<string>();

    return () => [
      <Section>
        <Heading>Cropping an image</Heading>
        <ImageCropper
          image={workingImage}
          width={300}
          height={300}
          onCropComplete={(croppedImage: { name: string; size: number }) =>
            (croppedFile.value = `${croppedImage.name} (${croppedImage.size} B)`)
          }
        />
        <Text>Cropped file: {croppedFile.value ?? "–"}</Text>
      </Section>,

      <Section>
        <Heading>Error event across the boundary</Heading>
        <ImageCropper
          image={crossOriginImage}
          width={300}
          height={300}
          onError={(error: { reason: string; message: string }) =>
            (reportedError.value = `${error.reason}: ${error.message}`)
          }
        />
        <Text>Reported error: {reportedError.value ?? "–"}</Text>
      </Section>,

      <Section>
        <Heading>Default error view</Heading>
        <ImageCropper image={missingImage} width={300} height={300} />
      </Section>,

      <Section>
        <Heading>Custom error view (slot)</Heading>
        <ImageCropper image={missingImage} width={300} height={300}>
          {{
            errorView: () => (
              <IllustratedMessage color="danger">
                <IconDanger />
                <Heading>Image unavailable</Heading>
                <Text>Please upload the image again.</Text>
              </IllustratedMessage>
            ),
          }}
        </ImageCropper>
      </Section>,
    ];
  },
});
