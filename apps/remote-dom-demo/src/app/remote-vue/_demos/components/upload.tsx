/** @jsxImportSource @/app/remote-vue/_lib */
import { ComponentGroupPage } from "@/app/remote-vue/_demos/components/lib/ComponentGroupPage";
import {
  Button,
  FileCard,
  FileCardList,
  FileDropZone,
  FileField,
  Heading,
  IconUpload,
  ImageCropper,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

const blueprint =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23264cff'/%3E%3Ccircle cx='200' cy='150' r='90' fill='%23ffd400'/%3E%3C/svg%3E";

/** The counterpart of `src/app/remote/components/upload/page.tsx`. */
export const UploadDemo = defineComponent({
  name: "UploadDemo",

  setup() {
    const files = ref<File[]>([
      new File(["Death Star plans"], "death-star-plans.txt", {
        type: "text/plain",
      }),
    ]);
    const croppedFile = ref<string>();

    return () => (
      <ComponentGroupPage title="Upload">
        <Section>
          <Heading level={3}>FileDropZone, FileCardList and FileCard</Heading>
          <FileDropZone
            multiple
            onChange={(dropped: FileList | null) => {
              if (dropped) {
                files.value = [...files.value, ...dropped];
              }
            }}
          >
            <IconUpload />
            <Heading>Drop the plans here</Heading>
            <FileField>
              <Button>Choose files</Button>
            </FileField>
          </FileDropZone>
          <FileCardList aria-label="Uploaded files">
            {files.value.map((file) => (
              <FileCard
                key={file.name}
                name={file.name}
                type={file.type}
                sizeInBytes={file.size}
                onDelete={() =>
                  (files.value = files.value.filter((f) => f !== file))
                }
              />
            ))}
          </FileCardList>
        </Section>

        <Section>
          <Heading level={3}>ImageCropper</Heading>
          <ImageCropper
            image={blueprint}
            width={300}
            height={300}
            onCropComplete={(croppedImage: File) =>
              (croppedFile.value = `${croppedImage.name} (${croppedImage.size} B)`)
            }
          />
          <Text>Cropped file: {croppedFile.value ?? "–"}</Text>
        </Section>
      </ComponentGroupPage>
    );
  },
});
