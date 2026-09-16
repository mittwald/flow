import {
  Heading,
  Icon,
  IllustratedMessage,
  ImageCropper,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { iconMonitoring } from "@/app/remote-vue/_demos/lib/icons";
import { defineComponent, h, ref } from "vue";

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
      h(Section, null, () => [
        h(Heading, null, () => "Cropping an image"),
        h(ImageCropper, {
          image: workingImage,
          width: 300,
          height: 300,
          onCropComplete: (croppedImage: { name: string; size: number }) =>
            (croppedFile.value = `${croppedImage.name} (${croppedImage.size} B)`),
        }),
        h(Text, null, () => `Cropped file: ${croppedFile.value ?? "–"}`),
      ]),

      h(Section, null, () => [
        h(Heading, null, () => "Error event across the boundary"),
        h(ImageCropper, {
          image: crossOriginImage,
          width: 300,
          height: 300,
          onError: (error: { reason: string; message: string }) =>
            (reportedError.value = `${error.reason}: ${error.message}`),
        }),
        h(Text, null, () => `Reported error: ${reportedError.value ?? "–"}`),
      ]),

      h(Section, null, () => [
        h(Heading, null, () => "Default error view"),
        h(ImageCropper, { image: missingImage, width: 300, height: 300 }),
      ]),

      h(Section, null, () => [
        h(Heading, null, () => "Custom error view (slot)"),
        h(
          ImageCropper,
          { image: missingImage, width: 300, height: 300 },
          {
            errorView: () =>
              h(IllustratedMessage, { color: "danger" }, () => [
                h(Icon, null, () => iconMonitoring()),
                h(Heading, null, () => "Image unavailable"),
                h(Text, null, () => "Please upload the image again."),
              ]),
          },
        ),
      ]),
    ];
  },
});
